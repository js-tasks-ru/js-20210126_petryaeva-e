export default class SortableTable {
    constructor(header = [], {data = []} = {}) {
        this.header = header;
        this.data = data;

        this.render();
    }

    getHeader = (data) => {
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${data.map(({id, title, sortable}) => {
                    return `
                        <div class="sortable-table__cell" data-id=${id} data-sortable=${sortable}>
                            <span>${title}</span>
                            <span data-element="arrow" class="sortable-table__sort-arrow">
                            <span class="sort-arrow"></span>
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    getBody = (data) => {
        return `
            <div data-element="body" class="sortable-table__body">
                ${this.getRows(data)}
            </div>
        `;
    }

    getRows = (data) => data.map(row => {
        return `
            <a href="/products/${row.id}" class="sortable-table__row">
                ${this.getCell(row)}
            </a>
        `;
    }).join('');

    getCell = (row) => this.header.map(({id, template}) => template
        ? template(row[id])
        : `<div class="sortable-table__cell">${row[id]}</div>`
    ).join('');

    compareString = (a, b, param) => {
        const compareString = (a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
    
        if (param === 'desc') {
            return compareString(b, a);
        } else {
            return compareString(a, b); 
        }
    }

    sort(field, orderValue) {
        const column = this.header.find(item => item.id === field);
        const {sortable, sortType} = column;
        const isDesc = orderValue === 'desc';

        if (!sortable) return;

        const data = [...this.data].sort((a, b) => {
            switch (sortType) {
                case 'string':
                    return this.compareString(a[field], b[field], orderValue);
                case 'number':
                    return isDesc ? b[field] - a[field] : a[field] - b[field];
                default:
                    return isDesc ? b[field] - a[field] : a[field] - b[field];
            }
        });

        for (const child of this.subElements.header.children) {
            if (child.dataset.id === column.id) {
                child.dataset.order = orderValue;
            } else {
                child.dataset.order = '';
            }
        }

        this.subElements.body.innerHTML = this.getRows(data);
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;

          return accum;
        }, {});
    }

    render() {
        const element = document.createElement('div');

        element.innerHTML = `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    ${this.getHeader(this.header)}
                    ${this.getBody(this.data)}
                </div>
            </div>
        `;
    
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(element);
    }

    remove() {
        this.element.remove();
    }
    
    destroy() {
        this.remove();
        this.subElements = {};
    }
}


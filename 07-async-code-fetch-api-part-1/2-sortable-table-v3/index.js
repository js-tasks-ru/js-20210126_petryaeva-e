import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    constructor(header = [], url = '') {
        this.header = header;
        this.url = url;

        this.render();
    }

    // getUrl(from, to) {
    //     this.url = new URL(this.url, REQUEST_URL);

    //     this.url.searchParams.set('from', from.toISOString());
    //     this.url.searchParams.set('to', to.toISOString());
    // }

    // async getDataRequest(from, to) {
    //     this.element.classList.add('column-chart_loading');
    //     this.subElements.header.textContent = '';
    //     this.subElements.body.innerHTML = '';

    //     this.getUrl(from, to);

    //     const response = await fetchJson(this.url);
    //     const data = Object.values(response);

    //     this.range = {from, to};

    //     if (response && data.length) {
    //         this.subElements.header.innerHTML = this.getHeaderTotalValue(data);
    //         this.subElements.body.innerHTML = this.getBody(data);

    //         this.element.classList.remove('column-chart_loading');
    //     }
    // }

    getHeader(data) {
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${data.map(({id, title, sortable}) => {
                    const {field, order} = this.sortParams;
                    const isSorting = field === id;
                    const dataOrder = isSorting ? order : 'asc';

                    return `
                        <div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${dataOrder}>
                            <span>${title}</span>
                            ${isSorting ? this.getSortingArrow : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    get getSortingArrow() {
        return `<span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`;
    };

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

    compareString = (value1, value2, param) => {
        const compareString = (str1, str2) => str1.localeCompare(str2, ['ru', 'en'], {caseFirst: 'upper'});
    
        return param === 'desc' ? compareString(value2, value1)  : compareString(value1, value2); 
    }

    sort(field, orderValue) {
        const column = this.header.find(item => item.id === field);
        const {sortable, sortType} = column;
        const isDesc = orderValue === 'desc';

        if (!sortable) return;

        return [...this.data].sort((a, b) => {
            const value1 = a[field];
            const value2 = b[field];

            switch (sortType) {
                case 'string':
                    return this.compareString(value1, value2, orderValue);
                case 'number':
                    return isDesc ? value2 - value1 : value1 - value2;
                default:
                    return isDesc ? value2 - value1 : value1 - value2;
            }
        });
    }

    getSubElements = (element) => {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;

          return accum;
        }, {});
    }

    handleChangeSort = (event) => {
        const parent = event.target.closest('[data-sortable="true"]');
        const orders = {
            asc: 'desc',
            desc: 'asc'
        };

        if (parent) {
            const {id, order} = parent.dataset;
            const data = this.sort(id, orders[order]);
            const arrow = parent.querySelector(".sortable-table__sort-arrow");

            parent.dataset.order = orders[order];

            if (!arrow) {
                parent.append(this.subElements.arrow);
            }

            this.subElements.body.innerHTML = this.getRows(data);
        }
    }

    render() {
        const element = document.createElement('div');
        const {field, order} = this.sortParams;
        const sortedData = this.sort(field, order);

        element.innerHTML = `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    ${this.getHeader(this.header)}
                    ${this.getBody(sortedData)}
                </div>
            </div>
        `;
    
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(element);

        this.subElements.header.addEventListener('pointerdown', event => this.handleChangeSort(event));
    }

    remove() {
        this.element.remove();
    }
    
    destroy() {
        this.remove();
        this.subElements = {};
    }
}

export default class ColumnChart {
    constructor({data = [], label = '', link = '', value = 0, chartHeight = 50} = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.chartHeight = chartHeight;

        this.render();
    }

    getTitle(label, link) {
        return `
            <div class="column-chart__title">
                Total ${label}
                ${link ? `<a href="/${link}" class="column-chart__link">View all</a>` : ''}
            </div>
        `;
    }

    getColumnProps(data) {
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;

        return data.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
    }

    getBody(data) {
        return `
            <div data-element="body" class="column-chart__chart">
                ${this.getColumnProps(data).map(item => {
                    return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`
                }).join('')}
            </div>
        `;
    }

    render() {
        const {data, label, link, value, chartHeight} = this;
        const loadingClass = data.length ? '' : 'column-chart_loading';
        const element = document.createElement('div');

        element.innerHTML = `
            <div class="column-chart ${loadingClass}" style="--chart-height: ${chartHeight}">
                ${this.getTitle(label, link)}
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${value}</div>
                    ${!!data.length ? this.getBody(data) : ''}
                </div>
            </div>
        `;
    
        this.element = element.firstElementChild;
    }

    update(data = []) {
        this.data = data;
        this.render();
    }

    remove() {
        this.element.remove();
    }
    
    destroy() {
        this.remove();
    }
}


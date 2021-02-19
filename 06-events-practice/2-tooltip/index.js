class Tooltip {
    constructor() {
        // this.render();
    }

    handleMouseOver = event => {
        const parent = event.target.closest('[data-tooltip]');

        if (parent) {
            this.render(parent.dataset.tooltip);
            document.addEventListener('pointerover', this.setPositionTooltip);
        }        
    }

    handleMouseOut = () => {
        if (this.element) {
            this.remove();
        }
    }

    setPositionTooltip = event => {
        this.element.style.left = `${event.clientX}px`;
        this.element.style.top = `${event.clientY}px`;
    }

    initialize = () => {
        document.addEventListener("pointerover", this.handleMouseOver);
        document.addEventListener("pointerout", this.handleMouseOut);
    }

    render(text) {
        const element = document.createElement('div');

        element.innerHTML = `<div class="tooltip">${text}</div>`;

        this.element = element.firstElementChild;
        document.body.append(this.element);
    }

    remove() {
        if (this.element) {
            this.element.remove();
            document.addEventListener('pointerover', this.setPositionTooltip);
            document.addEventListener("pointerover", this.handleMouseOver);
            document.addEventListener("pointerout", this.handleMouseOut);
        }
    }
    
    destroy() {
        this.remove();
    }
}

const tooltip = new Tooltip();

export default tooltip;

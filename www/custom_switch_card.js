class CustomSwitchCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            this.content = document.createElement('div');
            this.content.style.padding = '0 16px 16px';
            card.appendChild(this.content);
            this.appendChild(card);
        }

        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : 'unavailable';

        this.content.innerHTML = `
            <h2>${this.config.title}</h2>
            <div class="card">
                <div class="status">
                <p>Status: ${stateStr}</p>
                </div>
                <div class="controls">
                <button class="On/Off">Toggle</button>
                <button class="dim" data-level="1">Dim 1</button>
                <button class="dim" data-level="2">Dim 2</button>
                <button class="dim" data-level="3">Dim 3</button>
                </div>
            </div>
            `;

            this.content.querySelectorAll('.dim').forEach(button => {
                button.addEventListener('click', event => {
                  const level = event.target.getAttribute('data-level');
                  hass.callService('switch', 'dim', {
                    entity_id: entityId,
                    level: level
                  });
                });
              });

              this.content.querySelector('.toggle').addEventListener('click', () => {
                if (stateStr === 'on') {
                  hass.callService('switch', 'turn_off', {
                    entity_id: entityId
                  });
                } else {
                  hass.callService('switch', 'turn_on', {
                    entity_id: entityId
                  });
                }
              });
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = config;
    }

    getCardSize() {
        return 3;
    }
}

customElements.define('custom-switch-card', CustomSwitchCard);
class CustomSwitchCard extends HTMLElement {
    set hass(hass) {
      if(!this._hass){
        this._hass = hass
      }
      if (!this.content) {
          const card = document.createElement('ha-card');
          card.header = 'Light Control';
          this.content = document.createElement('div');
          this.content.style.padding = '0 16px 16px';
          card.appendChild(this.content);
          this.appendChild(card);
      }

        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : 'unavailable';

        this.content.innerHTML = `
          <h2>${stateStr}</h2>
          <button >On/Off</button>
          <input type="range" min="1" max="3" value="1" class="slider" id="dimSlider">
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

          this.content.querySelector('button').addEventListener('click', this._toggle.bind(this));
      this.content.querySelector('input.slider').addEventListener('change', event => {
        const level = parseInt(event.target.value,10);
        this._hass.callService('switch', 'dim', {
          entity_id: this.config.entity,
          level: level
        });
        this._hass.states[this.config.entity].state = 'on';
        this.hass = this._hass;
      });
    }
  
    setConfig(config) {
      if (!config.entity) {
        throw new Error('You need to define an entity');
      }
      this.config = config;
    }
  
    _toggle() {
      if (this._hass.states[this.config.entity].state === 'off') {
        this._hass.callService('switch', 'turn_on', {
          entity_id: this.config.entity
        });
        this._hass.states[this.config.entity].state = 'on';
      } else {
        this._hass.callService('switch', 'turn_off', {
          entity_id: this.config.entity
        });
        this._hass.states[this.config.entity].state = 'off';
      }
      this.hass = this._hass;
    }
}

customElements.define('custom-switch-card', CustomSwitchCard);
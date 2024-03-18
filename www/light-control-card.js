class LightControlCard extends HTMLElement {
    set hass(hass) {
      if (!this._hass) {
        this._hass = hass;
      }
  
      const entityId = this.config.entity;
      const state = hass.states[entityId];
      const stateStr = state ? state.state : 'unavailable';

      if (!this.content) {
        const card = document.createElement('ha-card');
        card.header = 'Light Control';
        this.content = document.createElement('div');
        this.content.style.padding = '0 16px 16px';
        card.appendChild(this.content);
        this.appendChild(card);
      }
  
      this.content.innerHTML = `
    <h2>${stateStr}</h2>
    <button >On/Off</button>
    <button class="dim" data-level="1">Dim 1</button>
    <button class="dim" data-level="2">Dim 2</button>
    <button class="dim" data-level="3">Dim 3</button>
  `;

      this.content.querySelector('button').addEventListener('click', this._toggle.bind(this));
      this.content.querySelectorAll('button.dim').forEach(button => {
        button.addEventListener('click', event => {
          const level = parseInt(event.target.dataset.level,10);
          this._hass.callService('switch', 'dim', {
            entity_id: this.config.entity,
            level: level
          });
          this._hass.states[this.config.entity].state = 'on';
          this.hass = this._hass;
        });
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
  
  customElements.define('light-control-card', LightControlCard);
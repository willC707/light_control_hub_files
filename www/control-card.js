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
        card.header = 'Light Control Hub';
        this.content = document.createElement('div');
        this.content.style.padding = '0 16px 16px';
        card.appendChild(this.content);
        this.appendChild(card);
      }
  
      this.content.innerHTML = `
    <h2>${stateStr}</h2>
    <button >On/Off</button>
    <input type="range" min="0" max="3" value="0" class="slider">
  `;

      this.content.querySelector('button').addEventListener('click', this._toggle.bind(this));
      this.content.querySelector('input.slider').addEventListener('change', event => {
        const level = parseInt(event.target.value, 10);
        this._hass.callService('switch', 'dim', {
          entity_id: this.config.entity,
          level: level
        });
        this._hass.states[this.config.entity.state = 'on';
        this.hass = this._hass;
      });

      const style = document.createElement('style');
      style.textContent = '
        .toggle {
          font-size: 20px;
          padding: 10px;
      }
      ';
        this.content.appendChild(style);
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

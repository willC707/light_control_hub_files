import serial
import logging
from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers import entity_platform
#from homeassistant.helpers import config_validation as vol
import voluptuous as vol

_LOGGER = logging.getLogger(__name__)

def setup_platform(hass, config, add_entities, discovery_info=None):
    port = config.get('port')
    baud_rate = config.get('baud_rate', 115200)

    try:
        ser = serial.Serial(port, baud_rate)
        add_entities([LightControlSwitch(ser)], True)
    except Exception as e:
        _LOGGER.error("Error during setup: %s", e)


class LightControlSwitch(SwitchEntity):
    def __init__(self, ser):
        self._ser = ser
        self._state = False
        self._dim_state = None

    @property
    def name(self):
        return "Light Control"

    @property
    def is_on(self):
        return self._state

    def turn_on(self, **kwargs):
        if self._dim_state is not None:
            self._ser.write(self._dim_state.encode())
        else:
            self._ser.write(b'I')
        self._state = True

    def turn_off(self, **kwargs):
        self._ser.write(b'O')
        self._state = False
        self._dim_state = None

    def dim(self, level):
        commands = {1:b'A', 2:b'B', 3:b'C'}
        self._ser.write(commands[level])
        self._dim_state = commands[level]
        self._state = True
        self.async_schedule_update_ha_state()

    async def async_added_to_hass(self):
        def handle_dim(call):
            entity_id = call.data.get('entity_id')
            level = call.data.get('level')

            if entity_id == self.entity_id:
                self.dim(level)

        self.hass.services.async_register('switch', 'dim', handle_dim, schema=vol.Schema({
            vol.Optional('entity_id'): vol.Coerce(str),
            'level': vol.Coerce(int),
        }))

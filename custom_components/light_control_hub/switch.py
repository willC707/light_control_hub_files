import serial
import logging
from homeassistant.components.switch import SwitchEntity

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

    @property
    def name(self):
        return "Light Control"

    @property
    def is_on(self):
        return self._state

    def turn_on(self, **kwargs):
        self._ser.write(b'I')
        self._state = True

    def turn_off(self, **kwargs):
        self._ser.write(b'O')
        self._state = False
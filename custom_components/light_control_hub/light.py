import serial
import logging
from homeassistant.components.light import LightEntity

_LOGGER = logging.getLogger(__name__)

def setup_platform(hass, config, add_entities, discovery_info=None):
    port = config.get('port')
    baud_rate = config.get('baud_rate', 115200)

    try:
        ser = serial.Serial(port, baud_rate)
        add_entities([LightControlLight(ser)], True)
    except Exception as e:
        _LOGGER.error("Error during setup: %s", e)

class LightControlLight(LightEntity):
    def __init__(self, ser) -> None:
        self._ser = ser
        self._state = False
        self._brightness = 0

    @property
    def name(self):
        return "Light control"
    
    @property
    def is_on(self):
        return self._state
    
    @property
    def brightness(self):
        return int(self._brightness/3 * 255)
    
    def turn_on(self, **kwargs):
        self._state = True
        if kwargs.get('brightness') is not None:
            self._brightness = kwargs.get('brightness') / 255 *3
            command = chr(ord('A') + int(self._brightness) - 1)
            self._ser.write(command.encode())

    def turn_off(self, **kwargs):
        self._ser.write(b'O')
        self._state = False
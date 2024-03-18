# import serial
# import logging

# _LOGGER = logging.getLogger(__name__)

# DOMAIN = "light_control_hub"

# def setup(hass, config):
#     port = config[DOMAIN].get("port", "/dev/ttyUSB0")
#     baud_rate = config[DOMAIN].get("baud_rate",115200)

#     try:
#         ser = serial.Serial(port, baud_rate)

#         return True
#     except Exception as e:
#         _LOGGER.error("Error during setup: %s", e)
#         return False


# import serial
# import logging
# import voluptuous as vol
# import homeassistant.helpers.config_validation as cv
# from homeassistant.components.switch import PLATFORM_SCHEMA, SwitchEntity

# _LOGGER = logging.getLogger(__name__)

# DOMAIN = "light_control_hub"

# CONF_PORT = "port"
# CONF_BAUD_RATE = "baud_rate"

# PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
#     vol.Required(CONF_PORT): cv.string,
#     vol.Optional(CONF_BAUD_RATE, default=115200): cv.positive_int,
# })

# def setup_platform(hass, config, add_entities, discovery_info=None):
#     port = config[CONF_PORT]
#     baud_rate = config[CONF_BAUD_RATE]

#     try:
#         ser = serial.Serial(port, baud_rate)
#         add_entities([LightControlSwitch(ser)],True)
#     except Exception as e:
#         _LOGGER.error("Error during setup: %s",e)

# class LightControlSwitch(SwitchEntity):
#     def __init__(self, ser) -> None:
#         self._ser = ser
#         self._state = False

#     @property
#     def name(self):
#         return "Light Control"
    
#     @property
#     def is_on(self):
#         return self._state
    
#     def turn_on(self, **kwargs):
#         self._ser.write(b'I')
#         self._state = True

#     def turn_off(self, **kwargs):
#         self._ser.write(b'O')
#         self._state = False

"""The light control hub component"""

# from homeassistant.helpers import entity_platform
# from voluptuous import Schema
# from homeassistant.helpers import entity_registry

# async def async_setup(hass, config):
#     def handle_dim(call):
#         entity_id = call.data.get('entity_id')
#         level = call.data.get('level')

#         # Get the entity registry
#         ent_reg = entity_registry.async_get(hass)

#         # Get the entity from the entity registry
#         entity = ent_reg.async_get(entity_id)
#         if entity is not None:
#             # You need to get the entity's state object to call its methods
#             state = hass.states.get(entity_id)
#             if state is not None:
#                 state.dim(level)

#     hass.services.async_register('switch', 'dim', handle_dim, schema=Schema({
#         'entity_id': str,
#         'level': int,
#     }))

#     return True

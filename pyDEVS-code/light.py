from pypdevs.DEVS import AtomicDEVS
from pypdevs.infinity import INFINITY
import random
import time

class LightState:
    def __init__(self):
        self.data_to_send = None
        self.output_port = None
        self.received_value = None


class Light(AtomicDEVS):
    def __init__(self, name="Light", **kwargs):
        AtomicDEVS.__init__(self, name)
        self.state = LightState()
        self.timeLast = 0.0
        
        # Initialize ports
        self.in_0 = self.addInPort("in_0")
        self.in_1 = self.addInPort("in_1")
        
        # Initialize parameters
        pass

        # Initialize timers
        pass

    def timeAdvance(self):
        """Return time until next internal transition"""
        return INFINITY if self.state.data_to_send is None else 0.0
        
    def intTransition(self):
        """Handle internal transition"""
        self.state.data_to_send = None
        return self.state

    def extTransition(self, inputs):
        """Handle external transition"""
        received_data = None
        for port_name, port_value in inputs.items():
            received_data
        # For actuator, handle inputs generically by port
        if received_data is not None:
            if port_name == self.in_0:
                print(f"[{self.name}] Processing input on port in_0")
                # Default action for port in_0
                self.state.data_to_send = received_data
            if port_name == self.in_1:
                print(f"[{self.name}] Processing input on port in_1")
                # Default action for port in_1
                self.state.data_to_send = received_data
        self.state.data_to_send = received_data
        return self.state

    def outputFnc(self):
        """Generate output"""
        result = {}
        return result

    def __lt__(self, other):
        """Comparison method required for sorting during simulation"""
        return self.name < other.name


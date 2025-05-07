from pypdevs.DEVS import AtomicDEVS
from pypdevs.infinity import INFINITY
import random
import time

class MotionSensorState:
    def __init__(self):
        self.MotionData = 0
        self.MotionTimer_next = 0.0
        self.data_to_send = None
        self.output_port = None
        self.received_value = None


class MotionSensor(AtomicDEVS):
    def __init__(self, name="MotionSensor", **kwargs):
        AtomicDEVS.__init__(self, name)
        self.state = MotionSensorState()
        self.timeLast = 0.0
        
        # Initialize ports
        self.out_0 = self.addOutPort("out_0")
        
        # Initialize parameters
        self.state.MotionData = kwargs.get('MotionData', 0)

        # Initialize timers
        self.state.MotionTimer_next = 1.0

    def timeAdvance(self):
        """Return time until next internal transition"""
                # Check if there's data to send immediately
        if self.state.data_to_send is not None:
            return 0.0
        
        next_time = INFINITY
        if hasattr(self.state, 'MotionTimer_next'):
            next_time = min(next_time, self.state.MotionTimer_next - self.timeLast)
        return next_time
        
    def intTransition(self):
        """Handle internal transition"""
        if hasattr(self.state, 'MotionTimer_next') and self.state.MotionTimer_next <= self.timeLast:
            self.state.MotionTimer_next = self.timeLast + 1.0
        self.state.data_to_send = None
        return self.state

    def extTransition(self, inputs):
        """Handle external transition"""
        print(f"extTransition called")
        return self.state

    def outputFnc(self):
        """Generate output"""
        result = {}
        # Generate sensor data
        sensor_data = {
            "m2m:cin": {
                "lbl": [
                    f"{self.name}"
                ],
                "con": f"{self.name}, {int(time.time())}, {random.randint(0, 1)}"
            }
        }
        # Send to all output ports
        for port_name in dir(self):
            if port_name.startswith('out_'):
                port = getattr(self, port_name)
                result[port] = sensor_data
        return result

    def __lt__(self, other):
        """Comparison method required for sorting during simulation"""
        return self.name < other.name


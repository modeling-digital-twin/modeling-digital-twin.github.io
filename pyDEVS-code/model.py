from pypdevs.DEVS import CoupledDEVS
from motionsensor import MotionSensor
from router import Router
from light import Light
class GeneratedModel(CoupledDEVS):
    def __init__(self):
        CoupledDEVS.__init__(self, "GeneratedModel")
        print("Model Loading...")
        
        # Initialize components
        self.c1 = self.addSubModel(MotionSensor("c1"))
        print("Initialized MotionSensor as c1")
        self.c2 = self.addSubModel(Router("c2"))
        print("Initialized Router as c2")
        self.c3 = self.addSubModel(Light("c3"))
        print("Initialized Light as c3")

        # Connect components
        self.connectPorts(self.c1.out_0, self.c2.in_0)
        print("Connected c1.out_0 to c2.in_0")
        self.connectPorts(self.c2.out_0, self.c3.in_1)
        print("Connected c2.out_0 to c3.in_1")
        self.connectPorts(self.c2.out_1, self.c3.in_0)
        print("Connected c2.out_1 to c3.in_0")

        print("Model initialization complete")

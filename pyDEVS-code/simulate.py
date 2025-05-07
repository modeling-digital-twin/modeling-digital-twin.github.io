
import sys
import os
import random
import time

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pypdevs.simulator import Simulator
from model import GeneratedModel

# Create the model
model = GeneratedModel()

# Create the simulator
sim = Simulator(model)

# Configure the simulation
sim.setTerminationTime(1000.0)  # Run for 1000 time units
sim.setClassicDEVS()  # Use classic DEVS formalism

# Use the correct setVerbose syntax for your PyDEVS version
# It expects either None or a string filename, not a boolean
sim.setVerbose(None)  # No additional verbosity

# Redirect stdout to capture log
log_file = 'simulation.log'
original_stdout = sys.stdout
try:
    with open(log_file, 'w') as f:
        sys.stdout = f
        # Run the simulation
        sim.simulate()
finally:
    # Restore stdout
    sys.stdout = original_stdout

print(f"Simulation complete. Results saved to {log_file}")

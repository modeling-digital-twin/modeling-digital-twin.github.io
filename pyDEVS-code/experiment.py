
import os
import subprocess
import sys

print("Running simulation...")

# Run the simulation
try:
    # First try to run with python command
    result = subprocess.run(['python', 'simulate.py'], capture_output=True, text=True)
    if result.returncode != 0 and sys.executable:
        # If that fails, try with the current Python interpreter
        print("Trying with current Python executable...")
        result = subprocess.run([sys.executable, 'simulate.py'], capture_output=True, text=True)
except Exception as e:
    print(f"Error running simulation: {e}")
    sys.exit(1)

# Print output
print("\nSimulation output:")
print(result.stdout)

if result.stderr:
    print("\nErrors:")
    print(result.stderr)

# Open the log file
try:
    with open('simulation.log', 'r') as f:
        log_content = f.read()
        print("\nSimulation Log Preview (first 1000 chars):")
        print(log_content[:1000])
        print("\n...\n")
except FileNotFoundError:
    print("Simulation log file not found.")

print("To view full log, open 'simulation.log'")

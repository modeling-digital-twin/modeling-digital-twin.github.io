# PythonPDEVS Introduction

PythonPDEVS is a Python implementation of the **Parallel Discrete Event System Specification (PDEVS)** formalism. It provides tools to model and simulate systems as a combination of **atomic** and **coupled models**, enabling hierarchical and modular system design.

**Atomic Models**:

- The **basic building blocks** of a DEVS system.
- Define **state variables**, **internal and external transitions**, **output functions**, and **time advance** functions.
- Handle input and output events independently.
- Each atomic model simulates the behavior of a single component.

**Coupled Models**:

- Allow **combining multiple atomic models (or other coupled models)** into a larger system.
- Define the **connections** (couplings) between submodels.
- Provide **hierarchical composition**, enabling complex systems to be built from simpler components.
- Do **not** define behavior themselves, but manage the structure and communication of submodels.

In PythonPDEVS, you build a system by first creating **atomic models** (with logic and state changes), then integrating them into a **coupled model** to define how they interact and exchange events.
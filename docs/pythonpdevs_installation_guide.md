# PythonPDEVS Installation Guide

1. **Prerequisites**
    
    
    - Make sure you have **Python 3.x** installed.
    - You may need **pip** (Python package manager).
    - Better to create virtual environment
2. **Clone the repository**  
    Open your terminal or command prompt and run:

    **For Python 3.6 and earlier**
    ```bash
    git clone https://github.com/capocchi/PythonPDEVS.git
    ```

    **For Python 3.7 and later:**
    ```bash
    git clone https://github.com/likhithkanigolla/PyPDEVS-Updated.git
    ```

3. **Navigate to the project directory**
    
    ```bash
    cd PythonPDEVS
    
    ```
4. **Install PythonPDEVS**  
    Run the following command to install it using `setup.py`:
    
    ```bash
    python setup.py install
    ```
    
    Alternatively, if you prefer installing in **development mode** (helpful if you plan to modify the source):
    
    ```bash
    python setup.py develop
    ```
import subprocess
import sys
import os

def run_backend():
    print("Starting DRIFT.AI Backend...")
    
    # Path to the backend directory
    backend_dir = os.path.join(os.getcwd(), 'Backend')
    
    # Path to the virtual environment python
    venv_python = os.path.join(os.getcwd(), 'venv', 'Scripts', 'python.exe')
    
    if not os.path.exists(venv_python):
        # Fallback to system python if venv not found
        venv_python = sys.executable
        print(f"⚠️ Virtual environment not found at root. Using {venv_python}")

    app_path = os.path.join(backend_dir, 'app.py')
    
    try:
        # Run the backend script
        subprocess.run([venv_python, app_path], cwd=backend_dir)
    except KeyboardInterrupt:
        print("\nBackend stopped.")
    except Exception as e:
        print(f"Error starting backend: {e}")

if __name__ == "__main__":
    run_backend()

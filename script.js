const steps = document.querySelectorAll('.form-step');
const indicators = document.querySelectorAll('.step-indicator');
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
    indicators[i].classList.toggle('active', i === index);
  });
}

document.querySelectorAll('.next').forEach(btn => {
  btn.addEventListener('click', () => {
    if (steps[currentStep].querySelector('input').checkValidity()) {
      currentStep++;
      showStep(currentStep);
    } else {
      steps[currentStep].querySelector('input').reportValidity();
    }
  });
});

document.querySelectorAll('.prev').forEach(btn => {
  btn.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
  });
});

document.getElementById('multiStepForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Form submitted!');
});

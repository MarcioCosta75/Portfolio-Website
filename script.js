document.getElementById('contact-form').addEventListener('submit', function(event) {
    let isValid = true;
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    if (!name.value) {
        isValid = false;
        alert('Por favor, insira seu nome.');
    }

    if (!email.value || !email.value.includes('@')) {
        isValid = false;
        alert('Por favor, insira um email válido.');
    }

    if (!message.value) {
        isValid = false;
        alert('Por favor, insira sua mensagem.');
    }

    if (isValid) {
        alert('Sua mensagem foi enviada com sucesso!');
        // Aqui você pode integrar com uma API de email, como EmailJS ou Firebase
    } else {
        event.preventDefault();
    }
});

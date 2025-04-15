document.addEventListener('DOMContentLoaded', () => {
    const messageTextarea = document.getElementById('message-text');
    const sendButton = document.getElementById('send-button');
    const messageList = document.getElementById('message-list');

    // Evento para enviar un nuevo mensaje al backend
    sendButton.addEventListener('click', () => {
        const message = messageTextarea.value.trim();
        if (message) {
            // Aquí iría la lógica para enviar el mensaje al backend
            // Usualmente se utiliza la función 'fetch' para hacer una petición POST
            console.log('Mensaje a enviar:', message);

            fetch('/api/messages', { // Reemplaza '/api/messages' con la ruta correcta de tu backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                messageTextarea.value = ''; // Limpiar el textarea después de enviar
                // Aquí podrías llamar a una función para recargar los mensajes
                loadMessages();
            })
            .catch(error => {
                console.error('Error al enviar el mensaje:', error);
            });
        } else {
            alert('Por favor, escribe un mensaje antes de enviar.');
        }
    });

    // Función para cargar los mensajes desde el backend y mostrarlos en la lista
    function loadMessages() {
        // Aquí iría la lógica para obtener los mensajes del backend
        // Usualmente se utiliza la función 'fetch' para hacer una petición GET
        fetch('/api/messages') // Reemplaza '/api/messages' con la ruta correcta de tu backend
            .then(response => response.json())
            .then(messages => {
                messageList.innerHTML = ''; // Limpiar la lista de mensajes actual
                messages.forEach(msg => {
                    const listItem = document.createElement('li');
                    listItem.textContent = msg.text; // Asumiendo que la respuesta del backend tiene un campo 'text'
                    messageList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error al cargar los mensajes:', error);
            });
    }

    // Cargar los mensajes iniciales al cargar la página
    loadMessages();
});

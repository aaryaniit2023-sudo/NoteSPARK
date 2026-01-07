class NoteSpark {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderNotes();
    }

    bindEvents() {
        document.getElementById('addBtn')
            .addEventListener('click', () => this.handleAddEdit());

        document.getElementById('clearBtn')
            .addEventListener('click', () => this.clearInput());

        document.getElementById('noteInput')
            .addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.handleAddEdit();
                }
            });
    }

    showAlert(message) {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.classList.add('show');
        setTimeout(() => alert.classList.remove('show'), 3000);
    }

    clearInput() {
        document.getElementById('noteInput').value = '';
        document.getElementById('addBtn').textContent = 'Add Note';
        this.editingId = null;
    }

    validateNote(content) {
        const trimmed = content.trim();
        if (!trimmed) {
            this.showAlert('Note cannot be empty!');
            return false;
        }
        if (trimmed.length > 1000) {
            this.showAlert('Maximum 1000 characters allowed!');
            return false;
        }
        return trimmed;
    }

    handleAddEdit() {
        const input = document.getElementById('noteInput');
        const content = this.validateNote(input.value);
        if (!content) return;

        if (this.editingId) {
            const note = this.notes.find(n => n.id === this.editingId);
            note.content = content;
            note.updatedAt = new Date().toISOString();
            this.showAlert('Note updated!');
        } else {
            this.notes.unshift({
                id: Date.now().toString(),
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            this.showAlert('Note added!');
        }

        this.saveNotes();
        this.renderNotes();
        this.clearInput();
    }

    deleteNote(id) {
        if (confirm('Delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.saveNotes();
            this.renderNotes();
        }
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        document.getElementById('noteInput').value = note.content;
        document.getElementById('addBtn').textContent = 'Update Note';
        this.editingId = id;
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    renderNotes() {
        const container = document.getElementById('notesContainer');
        container.innerHTML = '';

        if (this.notes.length === 0) {
            container.innerHTML =
                '<div class="notes-empty">No notes yet 🎉</div>';
            return;
        }

        this.notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const content = document.createElement('div');
            content.className = 'note-content';
            content.textContent = note.content;

            const actions = document.createElement('div');
            actions.className = 'note-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-small btn-edit';
            editBtn.textContent = '✏️ Edit';
            editBtn.onclick = () => this.editNote(note.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-small btn-delete';
            deleteBtn.textContent = '🗑️ Delete';
            deleteBtn.onclick = () => this.deleteNote(note.id);

            actions.append(editBtn, deleteBtn);
            card.append(content, actions);
            container.appendChild(card);
        });
    }
}

const app = new NoteSpark();

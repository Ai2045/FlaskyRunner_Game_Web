from app import app, db

# # automaticamente creare tutte le tabelle non esistenti
# with app.app_context():
#     db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
    
    
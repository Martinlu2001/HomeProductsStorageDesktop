import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';

class AppDatabase{

    constructor(){
        const dbPath = path.join(app.getPath('userData'), 'products.sqlite');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDataBase()
    }

    //crear la bd
    setUpDataBase(){
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS products (
            idProduct INTEGER PRIMARY KEY AUTOINCREMENT,
            nameProduct TEXT NOT NULL,
            cantProduct TEXT NOT NULL,
            fechaVencProduct TEXT NOT NULL
            )`)

            const columns = this.db.pragma("table_info(products)");
            const exists = columns.some(col => col.name === 'estadoProduct');
            
            if (!exists) {
                this.db.exec(`ALTER TABLE products ADD COLUMN estadoProduct TEXT NOT NULL DEFAULT 'cerrado'`);
                console.log("columna estadoProduct agregada");
            }
            console.log("db inicio")
    }

    //agregar producto
    addProduct(nameProduct, cantProduct, fechaVencProduct, estadoProduct = 'cerrado'){
        const stmt = this.db.prepare('INSERT INTO products (nameProduct, cantProduct, fechaVencProduct, estadoProduct) VALUES (?, ?, ?, ?)');
        const info = stmt.run(nameProduct, cantProduct, fechaVencProduct, estadoProduct);
        return{
            idProduct: info.lastInsertRowid,
            nameProduct: nameProduct,
            cantProduct: cantProduct,
            fechaVencProduct: fechaVencProduct,
            estadoProduct: estadoProduct
        }
    }

    //eliminar producto
    deleteProduct(idProduct){
        const stmt = this.db.prepare('DELETE FROM products WHERE idProduct = ?');
        const info = stmt.run(idProduct);
        return info.changes > 0;
    }

    //actualizar producto
    updateProduct(idProduct, nameProduct, cantProduct, fechaVencProduct, estadoProduct){
        const stmt = this.db.prepare('UPDATE products SET nameProduct = ?, cantProduct = ?, fechaVencProduct = ?, estadoProduct = ?  WHERE idProduct = ?');
        const info = stmt.run(nameProduct, cantProduct, fechaVencProduct, estadoProduct, idProduct);
        return info.changes > 0;
    }

    //mostrar productos
    getProduct(){
        const stmt = this.db.prepare('SELECT * from products ORDER BY fechaVencProduct ASC');
        return stmt.all()
    }
    close(){
        this.db.close();
        console.log("db closed");
    }
}
export default AppDatabase;
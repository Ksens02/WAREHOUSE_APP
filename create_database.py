import sqlite3
from datetime import datetime

def create_inventory_database():
    """Create an SQLite database for sports warehouse inventory."""
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect('warehouse_inventory.db')
    cursor = conn.cursor()
    
    # Create inventory table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT UNIQUE NOT NULL,
            product_name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity_in_stock INTEGER NOT NULL DEFAULT 0,
            min_stock_level INTEGER NOT NULL DEFAULT 10,
            unit_price REAL NOT NULL,
            supplier TEXT,
            location TEXT,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create index on category for better search performance
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_category ON inventory(category)
    ''')
    
    # Create index on SKU for faster lookups
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_sku ON inventory(sku)
    ''')
    
    conn.commit()
    conn.close()
    print("Database created successfully: warehouse_inventory.db")

def insert_sample_data():
    """Insert sample sports warehouse data."""
    
    conn = sqlite3.connect('warehouse_inventory.db')
    cursor = conn.cursor()
    
    sample_data = [
        ('SKU001', 'Basketball', 'Balls', 45, 10, 29.99, 'Spalding', 'Shelf A1'),
        ('SKU002', 'Soccer Ball', 'Balls', 38, 15, 24.99, 'Adidas', 'Shelf A2'),
        ('SKU003', 'Tennis Racket', 'Rackets', 22, 5, 89.99, 'Wilson', 'Shelf B1'),
        ('SKU004', 'Running Shoes - Size 10', 'Footwear', 15, 8, 129.99, 'Nike', 'Shelf C1'),
        ('SKU005', 'Yoga Mat', 'Mats & Pads', 60, 20, 34.99, 'Liforme', 'Shelf D1'),
        ('SKU006', 'Dumbbell Set (5kg)', 'Weights', 28, 10, 49.99, 'PowerTech', 'Shelf E1'),
        ('SKU007', 'Jumping Rope', 'Cardio', 75, 20, 12.99, 'Beaded', 'Shelf F1'),
        ('SKU008', 'Resistance Bands Set', 'Accessories', 42, 15, 19.99, 'TheraBand', 'Shelf F2'),
        ('SKU009', 'Volleyball', 'Balls', 30, 10, 27.99, 'Mikasa', 'Shelf A3'),
        ('SKU010', 'Tennis Shoes - Size 9', 'Footwear', 18, 8, 119.99, 'New Balance', 'Shelf C2'),
        ('SKU011', 'Cricket Bat', 'Sports Equipment', 12, 5, 149.99, 'Gray-Nicolls', 'Shelf B2'),
        ('SKU012', 'Badminton Racket', 'Rackets', 35, 10, 59.99, 'Yonex', 'Shelf B3'),
        ('SKU013', 'Swimming Goggles', 'Water Sports', 55, 20, 19.99, 'Speedo', 'Shelf G1'),
        ('SKU014', 'Bicycle Helmet', 'Safety', 40, 15, 79.99, 'Bell', 'Shelf H1'),
        ('SKU015', 'Skateboard Deck', 'Sports Equipment', 25, 8, 69.99, 'Tony Hawk', 'Shelf B4'),
        ('SKU016', 'Rowing Machine', 'Fitness Equipment', 8, 2, 599.99, 'Concept2', 'Shelf I1'),
        ('SKU017', 'Foam Roller', 'Accessories', 85, 25, 24.99, 'TriggerPoint', 'Shelf F3'),
        ('SKU018', 'Kettlebell (20kg)', 'Weights', 20, 8, 69.99, 'Rogue', 'Shelf E2'),
        ('SKU019', 'Golf Club Set', 'Golf', 11, 4, 399.99, 'Callaway', 'Shelf J1'),
        ('SKU020', 'Baseball Glove', 'Sports Equipment', 32, 10, 99.99, 'Wilson', 'Shelf B5'),
        ('SKU021', 'Sports Bottle (1L)', 'Accessories', 120, 40, 14.99, 'Hydro Flask', 'Shelf F4'),
        ('SKU022', 'Rope Climber', 'Fitness Equipment', 6, 2, 449.99, 'Rage', 'Shelf I2'),
        ('SKU023', 'Compression Shorts', 'Apparel', 95, 30, 34.99, 'Under Armour', 'Shelf K1'),
        ('SKU024', 'Athletic Socks (6-pack)', 'Apparel', 150, 50, 19.99, 'Dri-Fit', 'Shelf K2'),
        ('SKU025', 'Lacrosse Stick', 'Sports Equipment', 18, 6, 89.99, 'STX', 'Shelf B6'),
        ('SKU026', 'Boxing Gloves', 'Combat Sports', 27, 10, 59.99, 'Everlast', 'Shelf L1'),
        ('SKU027', 'Spin Bike', 'Fitness Equipment', 5, 1, 799.99, 'Peloton', 'Shelf I3'),
        ('SKU028', 'Protein Shaker Bottle', 'Accessories', 200, 60, 9.99, 'BlenderBottle', 'Shelf F5'),
        ('SKU029', 'Weight Lifting Belt', 'Accessories', 45, 15, 44.99, 'Schiek', 'Shelf F6'),
        ('SKU030', 'Gymnastic Mat', 'Mats & Pads', 16, 5, 149.99, 'Tumbl Trak', 'Shelf D2'),
    ]
    
    try:
        for item in sample_data:
            cursor.execute('''
                INSERT INTO inventory (sku, product_name, category, quantity_in_stock, 
                                     min_stock_level, unit_price, supplier, location)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', item)
        
        conn.commit()
        print(f"Inserted {len(sample_data)} sample records")
    except sqlite3.IntegrityError:
        print("Sample data already exists")
    finally:
        conn.close()

if __name__ == '__main__':
    create_inventory_database()
    insert_sample_data()

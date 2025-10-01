import sqlite3
from datetime import datetime
import tkinter as tk
from tkinter import ttk, messagebox

# Connect to SQLite database
conn = sqlite3.connect("expenses.db")
cursor = conn.cursor()

# Create table if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    category TEXT,
    amount REAL,
    description TEXT
)
""")
conn.commit()

# Functions
def add_expense():
    category = category_var.get()
    amount = amount_var.get()
    description = desc_var.get()
    if category == "" or amount == "":
        messagebox.showerror("Error", "Category and Amount are required")
        return
    try:
        amt = float(amount)
    except ValueError:
        messagebox.showerror("Error", "Amount must be a number")
        return
    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)",
                (date, category, amt, description))
    conn.commit()
    messagebox.showinfo("Success", "Expense added successfully!")
    amount_var.set("")
    desc_var.set("")
    view_expenses()

def view_expenses():
    records.delete(*records.get_children())
    cursor.execute("SELECT * FROM expenses")
    rows = cursor.fetchall()
    for row in rows:
        records.insert("", tk.END, values=row)

def view_by_category():
    cat = category_var.get()
    if cat == "":
        messagebox.showerror("Error", "Enter a category to filter")
        return
    records.delete(*records.get_children())
    cursor.execute("SELECT * FROM expenses WHERE category = ?", (cat,))
    rows = cursor.fetchall()
    for row in rows:
        records.insert("", tk.END, values=row)

def summary_report():
    cursor.execute("SELECT SUM(amount) FROM expenses")
    total = cursor.fetchone()[0]
    total = total if total else 0
    cursor.execute("SELECT category, SUM(amount) FROM expenses GROUP BY category")
    rows = cursor.fetchall()
    report = f"Total Expenses: {total}\n\n"
    for row in rows:
        report += f"{row[0]}: {row[1]}\n"
    messagebox.showinfo("Summary Report", report)

def delete_expense():
    selected = records.selection()
    if not selected:
        messagebox.showerror("Error", "Please select a record to delete")
        return
    
    record = records.item(selected[0])["values"]
    expense_id = record[0]  # ID column
    
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    
    messagebox.showinfo("Deleted", "Expense deleted successfully!")
    view_expenses()

# Tkinter UI setup
root = tk.Tk()
root.title("Expense Tracker")
root.geometry("800x550")
root.config(bg="#f4f6f7")

# Title Label
title = tk.Label(root, text="💰 Expense Tracker", font=("Arial", 20, "bold"), bg="#2c3e50", fg="white", pady=10)
title.pack(fill="x")

# Input frame
frame = tk.Frame(root, bg="#f4f6f7")
frame.pack(pady=15)

label_style = {"font": ("Arial", 12), "bg": "#f4f6f7"}
entry_style = {"font": ("Arial", 12), "width": 20}

# Category
tk.Label(frame, text="Category:", **label_style).grid(row=0, column=0, padx=10, pady=5)
category_var = tk.StringVar()
tk.Entry(frame, textvariable=category_var, **entry_style).grid(row=0, column=1, padx=10, pady=5)

# Amount
tk.Label(frame, text="Amount:", **label_style).grid(row=1, column=0, padx=10, pady=5)
amount_var = tk.StringVar()
tk.Entry(frame, textvariable=amount_var, **entry_style).grid(row=1, column=1, padx=10, pady=5)

# Description
tk.Label(frame, text="Description:", **label_style).grid(row=2, column=0, padx=10, pady=5)
desc_var = tk.StringVar()
tk.Entry(frame, textvariable=desc_var, **entry_style).grid(row=2, column=1, padx=10, pady=5)

# Buttons
btn_frame = tk.Frame(root, bg="#f4f6f7")
btn_frame.pack(pady=10)

btn_style = {"font": ("Arial", 11, "bold"), "bg": "#3498db", "fg": "white", "width": 15, "relief": "flat", "bd": 0, "pady": 5}

tk.Button(btn_frame, text="Add Expense", command=add_expense, **btn_style).grid(row=0, column=0, padx=8)
tk.Button(btn_frame, text="View All", command=view_expenses, **btn_style).grid(row=0, column=1, padx=8)
tk.Button(btn_frame, text="View by Category", command=view_by_category, **btn_style).grid(row=0, column=2, padx=8)
tk.Button(btn_frame, text="Summary Report", command=summary_report, **btn_style).grid(row=0, column=3, padx=8)
tk.Button(btn_frame, text="Delete Selected", command=delete_expense, **btn_style).grid(row=0, column=4, padx=8)

# Table frame
table_frame = tk.Frame(root)
table_frame.pack(pady=20, fill="both", expand=True)

columns = ("ID", "Date", "Category", "Amount", "Description")
records = ttk.Treeview(table_frame, columns=columns, show="headings", height=15)

# Scrollbars
scroll_y = ttk.Scrollbar(table_frame, orient="vertical", command=records.yview)
scroll_x = ttk.Scrollbar(table_frame, orient="horizontal", command=records.xview)
records.configure(yscroll=scroll_y.set, xscroll=scroll_x.set)

scroll_y.pack(side="right", fill="y")
scroll_x.pack(side="bottom", fill="x")
records.pack(fill="both", expand=True)

for col in columns:
    records.heading(col, text=col)
    records.column(col, width=140, anchor="center")  # 👈 yeh add karo


# Initial load
view_expenses()

root.mainloop()
conn.close()

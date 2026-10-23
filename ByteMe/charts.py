import matplotlib.pyplot as plt

def highly_rated_chart(self):
    items = [
        (data["name"], data["rating"], data["feedback_count"]) 
        for data in self.menu.values() 
        if data["feedback_count"] >= 2
    ]
    
    if not items:
        print("❌ Not enough rating data!")
        return

    items.sort(key=lambda x: x[1], reverse=True)
    top_items = items[:5]

    names = [f"{item[0]} ({item[2]} reviews)" for item in top_items]
    ratings = [item[1] for item in top_items]

    y_pos = range(len(names))

    
    plt.figure(figsize=(8,5), facecolor="#FFF8E7")
    ax = plt.gca()
    ax.set_facecolor("#FFF3D0")

    
    plt.hlines(y=y_pos, xmin=0, xmax=ratings, color="#FFB347", linewidth=3)

    
    plt.plot(ratings, y_pos, "*", markersize=15, color="#FF5A5F")

    #Labels
    for i, v in enumerate(ratings):
        plt.text(v + 0.1, i, f"{v:.1f}", va='center')

    plt.yticks(y_pos, names)
    plt.xlim(0, 5)

    plt.title("Top Rated Items (Average)", fontsize=14, weight='bold')
    plt.xlabel("Rating (1–5)")

    for spine in ax.spines.values():
        spine.set_visible(False)

    plt.grid(axis='x', linestyle='--', alpha=0.3)

    plt.tight_layout()
    plt.show()

def most_ordered_chart(self): 
    items = [(data["name"], data["orders"]) 
             for data in self.menu.values() 
             if data["orders"] > 0]
    
    if not items:
        print("No orders yet!")
        return

    items.sort(key=lambda x: x[1], reverse=True)
    top_items = items[:5]

    names = [item[0] for item in top_items]
    orders = [item[1] for item in top_items]

    colors = ["orange", "gold", "tomato", "salmon", "coral"]

    plt.figure(figsize=(7,4))
    plt.bar(names, orders, color=colors)

    # Value Labels
    for i in range(len(names)):
        plt.text(i, orders[i] + 0.2, orders[i],
             ha='center',
             fontsize=11,
             fontweight='bold',
             color="#5A3E2B")  # brownish (food theme)

    plt.title("Most Ordered Items", fontsize=14, fontweight='bold', color="#5A3E2B")
    plt.ylabel("Orders", fontsize=11)
    plt.xticks(rotation=10, fontsize=10)
    plt.show()
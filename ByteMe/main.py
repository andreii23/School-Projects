import datetime
from charts import highly_rated_chart, most_ordered_chart
from discounts import PointsDiscount, SeniorDiscount
from menu_data import menu, categories

# Main System Class
class FoodOrderingSystem:
    def __init__(self):
        self.categories = categories
        self.menu = menu

        self.order = {}
        self.points = 0
        self.history = []
        self.order_id = 1
        self.feedbacks = []

    def get_current_rating(self, item_id):
        count = self.menu[item_id]["feedback_count"]
        return self.menu[item_id]["rating"] if count > 0 else 0.0

    # Main Menu Display
    def show_main_menu(self):
        width = 60
        print("=" * width)
        print("🍔 ByteMe FOOD ORDERING SYSTEM".center(width))
        print(f"💎 Points: {self.points} | Orders: {len(self.history)}".center(width))
        print("=" * width)
        print("1.  📋 Order Food")
        print("2.  🛒 View Cart") 
        print("3.  💳 Checkout")
        print("4.  📜 Transaction History")
        print("5.  ⭐ Highly Rated Chart")
        print("6.  🔥 Most Ordered Chart")
        print("7.  💬 Feedback Menu")
        print("8.  📦 View Inventory")
        print("9.  ❌ Exit")
        print("-"*60)

    # Ordering Function
    def order_menu(self):
        while True:
            print("\n🛒 ORDER FOOD")
            print("===================================")
            print("👉 Select a category to view items.")
            print("👉 Type the NUMBER of the category or '0' to go back.\n")

            #Display Categories
            for i, cat in enumerate(self.categories.keys(), 1):
                print(f"{i}. {cat}")
            print("0. Back")

            choice = input("\nEnter choice: ").strip().lower()

            if choice in ['0', 'back', 'b']:
                return

            try:
                choice = int(choice)
                 # Valid Category Selection
                if 1 <= choice <= len(self.categories):

                    cat_name = list(self.categories.keys())[choice - 1]

                    if cat_name == "🔥 BEST SELLERS":
                        sorted_items = sorted(self.menu.items(), key=lambda x: x[1]["orders"], reverse=True)
                        cat_items = [item_id for item_id, data in sorted_items if data["orders"] > 0][:5]

                        if not cat_items:
                            print("❌ No best sellers yet!")
                            break
                    else:
                        cat_items = self.categories[cat_name]

                    while True:
                        print(f"\n📋 {cat_name.upper()} MENU")
                        print("-------------------------------------------------")
                        print("👉 Type ITEM ID to add to cart")
                        print("👉 Type '0' to go back\n")

                        for item_id in cat_items:
                            item = self.menu[item_id]
                            print(f"{item_id}. {item['name']:<25} ₱{item['price']} (Stock: {item['stock']})")

                        user_input = input("\nEnter choice: ").strip().lower()

                        # BACK
                        if user_input in ['0']:
                            break


                        # ADD DIRECT (TYPE ITEM ID)
                        else:
                            try:
                                item_id = int(user_input)

                                if item_id not in self.menu:
                                    print("❌ Invalid item ID!")
                                    continue

                                qty = int(input("Enter quantity: ").strip())

                                if qty <= 0:
                                    print("❌ Quantity must be greater than 0!")
                                    continue

                                if self.menu[item_id]["stock"] < qty:
                                    print("❌ Not enough stock!")
                                    continue

                                self.order[item_id] = self.order.get(item_id, 0) + qty
                                self.menu[item_id]["stock"] -= qty

                                print("✅ Item added to cart!")

                            except:
                                print("❌ Invalid input! Please enter a valid ID or command.")

            except:
                print("❌ Invalid input!")
    
    # Cart Management
    def cart_menu(self):
        while True:
            print("\n🧾 YOUR CART")
            print("===================================")

            if not self.order:
                print("🛒 Your cart is empty!")
                input("Press Enter to go back...")
                return

            total = 0
            cart_list = list(self.order.items())

            # VIEW
            for i, (item_id, qty) in enumerate(cart_list, 1):
                item = self.menu[item_id]
                subtotal = item['price'] * qty
                total += subtotal
                print(f"{i}. {item['name']} x{qty} = ₱{subtotal}")

            print("-----------------------------------")
            print(f"💰 Total: ₱{total}")

            # Actions
            print("\nActions:")
            print("C - Change quantity")
            print("D - Delete item")
            print("clear - Clear entire cart")
            print("0 - Back")

            action = input("\nEnter Action: ").strip().lower()

            if action == '0':
                return

            elif action == 'clear':
                confirm = input("⚠️ Clear entire cart? (y/n): ").strip().lower()
                if confirm == 'y':
                    for item_id, qty in self.order.items():
                        self.menu[item_id]["stock"] += qty
                    self.order.clear()
                    print("🗑️ Cart cleared!")
                    return
                else:
                    continue

            elif action in ['c', 'd']:
                try:
                    choice = int(input("Select item #: ")) - 1
                    if not (0 <= choice < len(cart_list)):
                        print("❌ Invalid item!")
                        continue

                    item_id, current_qty = cart_list[choice]

                    if action == 'c':
                        try:
                            new_qty = int(input("Enter new quantity: "))

                            old_qty = current_qty
                            difference = new_qty - old_qty

                            if new_qty > 0:
                                if difference > 0 and self.menu[item_id]["stock"] < difference:
                                    print("❌ Not enough stock!")
                                    continue

                                self.menu[item_id]["stock"] -= difference
                                self.order[item_id] = new_qty
                                print("✅ Quantity updated!")

                            else:
                                self.menu[item_id]["stock"] += old_qty
                                del self.order[item_id]
                                print("🗑️ Item deleted!")
                        except:
                            print("❌ Invalid quantity!")

                    elif action == 'd':
                        self.menu[item_id]["stock"] += current_qty
                        del self.order[item_id]
                        print("🗑️ Item deleted!")

                except:
                    print("❌ Invalid input!")

            else:
                print("❌ Invalid action!")
            
    #Checkout
    def checkout(self):
        
        if not self.order:
            print("🛒 Empty cart!")
            return
        
        confirm = input("\nProceed to checkout? (y/n): ").lower()
        if confirm != 'y':
            return
        
        subtotal = sum(self.menu[item_id]['price'] * qty for item_id, qty in self.order.items())
        total = subtotal
        discount = 0
        
        width = 55
        print("\n" + "=" * width)
        print("💳 CHECKOUT".center(width))
        print("=" * width)
        
        print("\n🛒 ORDER ITEMS:")
        for item_id, qty in self.order.items():
            item = self.menu[item_id]
            subtotal_item = item['price'] * qty
            print(f"  {item['name']:<35} x{qty:2d} = ₱{subtotal_item:>6d}")
        
        print(f"\nSUBTOTAL:              ₱{subtotal:>8.2f}")
        
        discounts = []

        # Senior Discount
        senior = input("\n👴 Senior/PWD? (y/n): ").lower() == 'y'
        if senior:
            discounts.append(SeniorDiscount())

        # Points Discount
        use_points = False
        if self.points >= 10:
            max_discount = int(subtotal * 0.30)
            print(f"💡 Points discount cap: ₱{max_discount} (30%)")
            use_points = input("Use points? (y/n): ").lower() == 'y'
            if use_points:
                discounts.append(PointsDiscount(self.points))

        # Applt Discounts 
        for d in discounts:
            old_total = total
            new_total = d.apply(total)
            discount_amount = old_total - new_total

            # For Displaying Discount Breakdown
            if isinstance(d, SeniorDiscount):
                print(f"✅ Senior 20% OFF: -₱{discount_amount:.2f}")

            elif isinstance(d, PointsDiscount):
                print(f"✅ Points Discount: -₱{discount_amount:.2f}")
                self.points -= d.points_used

            discount += discount_amount
            total = new_total

        earned_points = int(total * 0.10)
        final_points = self.points + earned_points
        
        width = 55

        print("\n" + "="*width)
        print("📄 OFFICIAL RECEIPT".center(width))
        print("="*width)

        print(f"ORD{self.order_id:04d}{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'):>{width-8}}")

        print()

        for item_id, qty in self.order.items():
            item = self.menu[item_id]
            print(f"{item['name']:<30} x{qty} ₱{item['price']*qty:>7.2f}")

        print()
        print(f"Subtotal: ₱{subtotal:.2f}")
        print(f"Discount: -₱{discount:.2f}")
        print(f"Total:    ₱{total:.2f}")
        print(f"Points: +{earned_points}  |  {final_points}")

        print("-"*width)
        print()

        # SAVE FULL RECEIPT TO HISTORY
        receipt = {
            "id": self.order_id,
            "order_id": f"ORD{self.order_id:04d}",
            "timestamp": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "items": [(self.menu[item_id]['name'], self.menu[item_id]['price'], qty) for item_id, qty in self.order.items()],
            "subtotal": subtotal,
            "discount": discount,
            "total": total,
            "points_earned": earned_points
        }
        self.history.append(receipt)
        self.points = final_points
        self.order_id += 1
        
        # Update orders count
        for item_id, qty in self.order.items():
            self.menu[item_id]["orders"] += qty
        
        self.order = {}

    #Transaction History
    def transaction_history(self):
        if not self.history:
            print("📜 No transactions!")
            return
        
        print("\n📜 HISTORY (Last 10):")
        print(" # | Order ID  | Date      | Total")
        print("-"*40)
        for i, receipt in enumerate(self.history[-10:], 1):
            print(f"{i:2d} | {receipt['order_id']:<9} | {receipt['timestamp'][:16]:<11} | ₱{receipt['total']:>7.2f}")
        
        choice = input("\nView receipt # (0=back): ").strip()
        if choice == '0':
            return
        
        recent = self.history[-10:]

        try:
            idx = int(choice) - 1
            if 0 <= idx < len(recent):
                self.show_receipt(recent[idx])
        except:
            print("❌ Invalid!")

    def show_receipt(self, receipt):
        width = 55
        print("\n" + "=" * width)
        print("📄 RECEIPT".center(width))
        print("=" * width)

        print(f"{receipt['order_id']} | {receipt['timestamp']}".center(width))
        print()

        total_items = 0
        for name, price, qty in receipt['items']:
            subtotal = price * qty
            total_items += qty
            print(f"{name:<30} x{qty:<2} ₱{subtotal:>7.2f}")

        print()
        print(f"{'Subtotal':<35} ₱{receipt['subtotal']:>8.2f}")
        print(f"{'Discount':<35} -₱{receipt['discount']:>7.2f}")
        print(f"{'Total':<35} ₱{receipt['total']:>8.2f}")
        print(f"{'Points Earned':<35} +{receipt['points_earned']}")

        print("-" * width)
        print("Thank you for your order!".center(width))
        print("-" * width)
        print()

    def feedback(self):
        print("\n💬 GIVE FEEDBACK")
        print("Available items with orders:")
            
        feedback_items = []
        for item_id, data in self.menu.items():
            if data["orders"] > 0 or data["feedback_count"] > 0:
                feedback_items.append((item_id, data["name"], data["orders"]))
            
        if not feedback_items:
            print("❌ No items available for feedback yet!")
            return
            
        print("(Showing up to 10 items)\n")
            
        for i, (item_id, name, orders) in enumerate(feedback_items[:10], 1):
            rating = self.get_current_rating(item_id)
            stars = "★" * int(rating) + "☆" * (5 - int(rating))
            print(f"{i}. {name:<30} {stars} ({rating:.1f}) | Orders: {orders}")
            
        try:
            choice = int(input("\nSelect item to rate ( Input '0' to go back): ")) - 1
            if choice < 0 or choice >= len(feedback_items):
                return
                
            item_id, name, _ = feedback_items[choice]
                
            # Get star rating (1-5)
            while True:
                try:
                    stars = int(input(f"\n⭐ Rate {name} (1-5 stars): "))
                    if 1 <= stars <= 5:
                        break
                    print("❌ Please enter 1-5!")
                except:
                    print("❌ Invalid input!")
                
            # Optional written feedback
            written_feedback = input("💭 Written feedback (optional, Enter to skip): ").strip()
                
            # Update rating
            item = self.menu[item_id]
            total_rating = item["rating"] * item["feedback_count"]
            item["feedback_count"] += 1
            item["rating"] = (total_rating + stars) / item["feedback_count"]
                
            # Save feedback
            self.feedbacks.append({
                "item_id": item_id,
                "item_name": name,
                "stars": stars,
                "comment": written_feedback,
                "timestamp": datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
            })
                
            stars_display = "★" * stars + "☆" * (5 - stars)
            print(f"\n✅ Thanks for your feedback!")
            print(f"   {name}: {stars_display} ({item['rating']:.1f} avg)")
            if written_feedback:
                print(f"   Comment: {written_feedback}")
                    
        except:
            print("❌ Invalid selection!")

    def feedback_menu(self):
        while True:
            print("\n💬 FEEDBACK MENU")
            print("1. Give Feedback")
            print("2. View Feedback")
            print("0. Back")

            choice = input("Choice: ").strip()

            if choice == '1':
                self.feedback()
            elif choice == '2':
                self.view_feedback()
            elif choice == '0':
                return
            else:
                print("❌ Invalid choice!")
            
    def view_feedback(self):
        print("\n📝 ALL FEEDBACKS")
        print("=" * 60)

        if not self.feedbacks:
            print("❌ No feedback yet!")
            return

        for i, fb in enumerate(self.feedbacks, 1):
            stars = "★" * fb["stars"] + "☆" * (5 - fb["stars"])
            print(f"{i}. {fb['item_name']} | {stars}")
            print(f"   🕒 {fb['timestamp']}")

            if fb["comment"]:
                print(f"   💬 {fb['comment']}")
            else:
                print("   💬 (No comment)")

            print("-" * 60)

    def inventory(self): 
        print("\n📦 INVENTORY STATUS")
        print("-" * 60)
        print("ID  | Item Name                  | Stock | Orders | Rating")
        print("-"*60)
        
        low_stock = []
        for item_id, data in self.menu.items():
            rating = self.get_current_rating(item_id)
            stars = "★" * int(rating) + "☆" * (5 - int(rating)) if rating > 0 else "---"
            stock_status = "⚠️ LOW" if data["stock"] < 10 else "✅ OK"
            print(f"{item_id:3d} | {data['name']:<25} | {data['stock']:4d} {stock_status} | {data['orders']:6d} | {stars}")
            
            if data["stock"] < 10 and data["orders"] > 0:
                low_stock.append((item_id, data['name'], data['stock']))
        
        if low_stock:
            print("\n⚠️  LOW STOCK ALERTS:")
            for item_id, name, stock in low_stock:
                print(f"   {item_id}: {name} ({stock} left)")
    
    def run(self):
        while True:
            self.show_main_menu()
            choice = input("Choice: ").strip()
            if choice == '1': self.order_menu()
            elif choice == '2': self.cart_menu()
            elif choice == '3': self.checkout()
            elif choice == '4': self.transaction_history()
            elif choice == '5': highly_rated_chart(self)
            elif choice == '6': most_ordered_chart(self)
            elif choice == '7': self.feedback_menu()
            elif choice == '8': self.inventory()
            elif choice == '9': print("Thank you for Visiting ByteMe!"); break
            else: print("❌ 0-9!")

if __name__ == "__main__":
    FoodOrderingSystem().run()
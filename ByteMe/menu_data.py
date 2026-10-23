categories = {
            "🔥 BEST SELLERS": [],
            "🍔 BURGERS": list(range(1, 4)),
            "🥗 VEGGIES": list(range(4, 7)),
            "🍰 PASTRY": list(range(7, 13)),
            "🧇 WAFFLES": list(range(13, 24)),
            "🥞 PANCAKES": list(range(24, 30)),
            "🍖 SAVOURIES": list(range(30, 35)),
            "🧋 MILKTEA": list(range(35, 40)),
            "🍹 JUICES": list(range(40, 46)),
            "☕ COFFEE": list(range(46, 50)),
            "🍧 BINGSU": list(range(50, 55)),
            "🧊 FRAPPE": list(range(55, 61)),
            "🍺 BOOZE": list(range(61, 70))
        }
menu = {
            # 🍔 BURGER
            1: {"name": "Burger Lite", "price": 59, "stock": 50, "rating": 0.0, "feedback_count": 0, "orders": 0},
            2: {"name": "Burger.py", "price": 79, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            3: {"name": "Root Burger", "price": 99, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🥗 VEGGIES
            4: {"name": "Asar Debug", "price": 149, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            5: {"name": "Fiesta UI", "price": 99, "stock": 35, "rating": 0.0, "feedback_count": 0, "orders": 0},
            6: {"name": "All-in Stack", "price": 269, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🥐 PASTRY
            7: {"name": "Empanada.exe", "price": 49, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},
            8: {"name": "Tiramisu Stack", "price": 129, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            9: {"name": "Cheesecake Panic", "price": 119, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            10: {"name": "Cinna Loop", "price": 89, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            11: {"name": "Macaron Bits", "price": 69, "stock": 50, "rating": 0.0, "feedback_count": 0, "orders": 0},
            12: {"name": "Brownie Dark", "price": 89, "stock": 35, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🧇 WAFFLES
            13: {"name": "Smores RAM", "price": 109, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            14: {"name": "Nutella Patch", "price": 189, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            15: {"name": "Choco Cache", "price": 89, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            16: {"name": "Rocky Runtime", "price": 129, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            17: {"name": "Banana Script", "price": 99, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            18: {"name": "Blueberry Cloud", "price": 129, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            19: {"name": "Choco Hazel Ragasa", "price": 179, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            20: {"name": "Oreo Framework", "price": 109, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            21: {"name": "Caramel Compile", "price": 119, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            22: {"name": "Strawberry API", "price": 129, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            23: {"name": "Cheese Firmware", "price": 149, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🥞 PANCAKES
            24: {"name": "Hershey Build", "price": 169, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            25: {"name": "Matcha UI", "price": 209, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            26: {"name": "Cheezy Plug-in", "price": 149, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            27: {"name": "Cream Layer", "price": 99, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            28: {"name": "Straw Patch", "price": 129, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            29: {"name": "Custard Engine", "price": 109, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🍢 SAVOURIES
            30: {"name": "Sisig Fix", "price": 99, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            31: {"name": "Hotdog Script", "price": 79, "stock": 50, "rating": 0.0, "feedback_count": 0, "orders": 0},
            32: {"name": "Wings Firewall", "price": 79, "stock": 50, "rating": 0.0, "feedback_count": 0, "orders": 0},
            33: {"name": "Tokwa OSS", "price": 59, "stock": 50, "rating": 0.0, "feedback_count": 0, "orders": 0},
            34: {"name": "Tusok Thread Platter", "price": 99, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🧋 MILKTEA
            35: {"name": "Taro Data", "price": 109, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            36: {"name": "Okinawa Legacy", "price": 109, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            37: {"name": "Matcha AI", "price": 119, "stock": 35, "rating": 0.0, "feedback_count": 0, "orders": 0},
            38: {"name": "Thai Control", "price": 119, "stock": 35, "rating": 0.0, "feedback_count": 0, "orders": 0},
            39: {"name": "Yogurt Cloud", "price": 129, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🧃 JUICE
            40: {"name": "Herbal Clean", "price": 49, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},
            41: {"name": "Straw Script", "price": 59, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},
            42: {"name": "Lemon Func", "price": 49, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},
            43: {"name": "Mango Run", "price": 59, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},
            44: {"name": "Lychee Lite", "price": 49, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},
            45: {"name": "Blue Stream", "price": 59, "stock": 60, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # ☕ COFFEE
            46: {"name": "Macchiato Debug", "price": 109, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            47: {"name": "Latte Loop", "price": 109, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            48: {"name": "Filo Local", "price": 109, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            49: {"name": "Belgian Kernel", "price": 109, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🍧 BINGSU
            50: {"name": "Halo Data", "price": 189, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            51: {"name": "Mango Fusion", "price": 179, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            52: {"name": "Oreo Dual", "price": 179, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            53: {"name": "Raspberry UI", "price": 89, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            54: {"name": "Ube Stack", "price": 179, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🧋 FRAPPE
            55: {"name": "Choco GPU", "price": 139, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            56: {"name": "Java Compile", "price": 139, "stock": 35, "rating": 0.0, "feedback_count": 0, "orders": 0},
            57: {"name": "Coffee Soft", "price": 129, "stock": 45, "rating": 0.0, "feedback_count": 0, "orders": 0},
            58: {"name": "Blue Memory", "price": 149, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            59: {"name": "Black Web", "price": 149, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            60: {"name": "Dragon Surge", "price": 149, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},

            # 🍻 BOOZE
            61: {"name": "Tequila Root", "price": 289, "stock": 15, "rating": 0.0, "feedback_count": 0, "orders": 0},
            62: {"name": "Mojito Refresh", "price": 249, "stock": 20, "rating": 0.0, "feedback_count": 0, "orders": 0},
            63: {"name": "Soju Silent", "price": 179, "stock": 25, "rating": 0.0, "feedback_count": 0, "orders": 0},
            64: {"name": "Sapporo Server", "price": 559, "stock": 10, "rating": 0.0, "feedback_count": 0, "orders": 0},
            65: {"name": "SanMig Lite", "price": 89, "stock": 40, "rating": 0.0, "feedback_count": 0, "orders": 0},
            66: {"name": "Alfonso Legacy", "price": 389, "stock": 15, "rating": 0.0, "feedback_count": 0, "orders": 0},
            67: {"name": "Gin Hack", "price": 99, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            68: {"name": "Smirnoff Secure", "price": 89, "stock": 30, "rating": 0.0, "feedback_count": 0, "orders": 0},
            69: {"name": "Wine Vault", "price": 489, "stock": 10, "rating": 0.0, "feedback_count": 0, "orders": 0},
}

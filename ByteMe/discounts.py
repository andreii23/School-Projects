from abc import ABC, abstractmethod

class Discount(ABC):
    @abstractmethod
    def apply(self, total):
        pass

class SeniorDiscount(Discount):
    def apply(self, total):
        return total * 0.80

class PointsDiscount(Discount):
    def __init__(self, points):
        self.points = points
        self.points_used = 0

    def apply(self, total):
        max_discount = int(total * 0.30)
        points_discount = min(self.points, max_discount)
        self.points_used = points_discount
        return total - points_discount

export const addDiscountPurchase = async(total, discountPurchase, setTotal, setTotalDiscount) => {
    if (discountPurchase !== null) {
        let discount_percentage = parseInt(discountPurchase.Porcentaje) / 100;
        let new_total = total - (total * discount_percentage);
        let discount_total = total * discount_percentage;

        setTotal(new_total);
        setTotalDiscount(discount_total);
        
   }
}
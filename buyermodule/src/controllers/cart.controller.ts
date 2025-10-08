import {repository} from '@loopback/repository';
import {post, get, param, requestBody, HttpErrors} from '@loopback/rest';
import {CartRepository, CartitemsRepository, ProductsRepository} from '../repositories';

export class CartController {
  constructor(
    @repository(CartRepository) public cartRepo: CartRepository,
    @repository(CartitemsRepository) public cartItemRepo: CartitemsRepository,
    @repository(ProductsRepository) public productRepo: ProductsRepository,
  ) {}

  @post('/buyers/{buyerId}/cart')
  async createCart(@param.path.number('buyerId') buyerId: number) {
    const existing = await this.cartRepo.findOne({
      where: {buyer_id: buyerId, status: 'OPEN'},
    });
    if (existing) return existing;

    return this.cartRepo.create({
      buyer_id: buyerId,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    });
  }

  @post('/cart/{cartId}/items')
  async addItem(
    @param.path.number('cartId') cartId: number,
    @requestBody() payload: {product_id: number; quantity: number},
  ) {
    const product = await this.productRepo.findById(payload.product_id);
    if (!product) throw new HttpErrors.NotFound('Product not found');
    if (product.stock < payload.quantity) {
      throw new HttpErrors.BadRequest('Insufficient stock');
    }

    const item = await this.cartItemRepo.create({
      cart_id: cartId,
      product_id: payload.product_id,
      quantity: payload.quantity,
      price_at_add: product.price,
    });

    return item;
  }

  @get('/cart/{cartId}')
  async viewCart(@param.path.number('cartId') cartId: number) {
    const items = await this.cartItemRepo.find({where: {cart_id: cartId}});
    return {cartId, items};
  }
}

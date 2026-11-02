import { expect, Page } from "@playwright/test";
import { productsLocators } from "../locators/products.locators";

export class ProductsPage {
  private readonly ui;

  constructor(private readonly page: Page) {
    this.ui = productsLocators(page);
  }

  async expectVisible(): Promise<void> {
    await expect(this.ui.productsHeading).toBeVisible();
  }

  async openFirstProduct(): Promise<void> {
    await this.ui.firstViewProductLink.click();
    await this.page.waitForURL(/\/product_details\//);
    await expect(this.ui.productInformation).toBeVisible();
  }

  async addProductToCart(): Promise<void> {
    await this.ui.addToCartButton.click();
  }

  async hoverFirstProduct(): Promise<void> {
    await this.ui.firstProductCard.scrollIntoViewIfNeeded();
    await this.ui.firstProductCard.hover();
  }

  /** The overlay's click handler binds late on this site, so retry hover + click until the modal opens. */
  async addFirstProductFromOverlay(): Promise<void> {
    await expect(async () => {
      await this.hoverFirstProduct();
      await expect(this.ui.firstProductOverlayAdd).toBeVisible({ timeout: 2000 });
      await this.ui.firstProductOverlayAdd.click();
      await expect(this.ui.cartModal).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 20000 });
  }

  async expectCartModalVisible(): Promise<void> {
    await expect(this.ui.cartModal).toBeVisible();
  }

  async dismissCartModal(): Promise<void> {
    await this.ui.modalContinueButton.click();
    await expect(this.ui.cartModal).toBeHidden();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.ui.quantityInput.fill(String(quantity));
  }

  async openCartFromModal(): Promise<void> {
    await this.ui.viewCartLink.click();
  }
}

Feature: Checkout and E-commerce Flow

  # 1. Standard / Vanilla tests (no custom fixtures, using page directly)
  @regression
  Scenario: User can add a product to cart and see the cart badge update
    Given I open the inventory page
    When I add "Backpack" to the cart
    Then the shopping cart badge should show "1"
    When I click the shopping cart link
    Then I should be redirected to the cart page
    And I should see 1 item in the cart

  @regression
  Scenario: User can complete the full checkout flow
    Given I open the inventory page
    When I add "Backpack" to the cart
    And I add "Bike Light" to the cart
    And I click the shopping cart link
    And I click the checkout button
    And I fill the checkout form with "Diwakar", "Thakur", "140301"
    And I click the continue button
    Then the order summary total should be visible
    When I click the finish button
    Then I should see the order confirmation message "Thank you for your order!"

  # 2. Advanced tests using custom Playwright fixtures
  @regression
  Scenario: Inventory page shows products (using fixture)
    Given I am on the inventory page via fixture
    Then the page title should be "Products"

  @regression
  Scenario: User can see product prices (using fixture)
    Given I am on the inventory page via fixture
    Then I should see "$" in the first product price

  @regression
  Scenario: Cart shows correct item count badge (using fixture)
    Given I am on the cart page via fixture
    Then the shopping cart badge should show "1"

  @regression
  Scenario: Cart item has correct product name (using fixture)
    Given I am on the cart page via fixture
    Then the cart item name should be "Sauce Labs Backpack"

  @regression
  Scenario: User can fill checkout form and see order summary (using fixture)
    Given I am on the checkout info page via fixture
    When I fill the checkout form with "Diwakar", "Thakur", "140301"
    And I click the continue button
    Then the order summary total should be visible

  @regression
  Scenario: User can complete full order and see confirmation (using fixture)
    Given I am on the checkout info page via fixture
    When I fill the checkout form with "Diwakar", "Thakur", "140301"
    And I click the continue button
    And I click the finish button
    Then I should see the order confirmation message "Thank you for your order!"

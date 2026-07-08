Feature: Login Functionality

  Scenario: Login page loads with input fields
    Given I open the login page
    Then I should see the username input field
    And I should see the password input field

  Scenario: standard_user can log in successfully
    Given I open the login page
    When I fill standard credentials
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see 6 inventory items

  Scenario: locked_out_user is blocked with an error message
    Given I open the login page
    When I fill locked out credentials
    And I click the login button
    Then I should see a login error message containing "locked out"

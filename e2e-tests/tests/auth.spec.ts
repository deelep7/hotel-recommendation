import { test, expect } from '@playwright/test';

const UI_URL ="http://localhost:5174/";


test('should not allow the user to sign in', async ({ page }) => {

  await page.goto(UI_URL);


  //get sin in buton
  await page.getByRole("link",{ name: "Sign in"}).click();

  await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();

  await page.locator("[name=email]").fill("dilippoudel466@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", {name: "Login"}).click();

  await expect(page.getByText("Sign in Sucessful!")).toBeVisible();
  await expect(page.getByRole("link", {name:"My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name:"My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name:"SignOut"})).toBeVisible();


});
 test("should allow user to register", async ({page}) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000 )+ 10000}@test.com`

  await page.goto(UI_URL)
  


  await page.getByRole("link", {name:"Sign in"}).click();
  await page.getByRole("link", {name:"Create an account here"}).click();
  await expect (
    page.getByRole("heading", {name:"Create An Account"}))
    .toBeVisible();

    await page.locator("[name=firstName]").fill("test_firstName")
    await page.locator("[name=lastName]").fill("test_testName")
    await page.locator("[name=email]").fill(testEmail)
    await page.locator("[name=password]").fill("123456")
    await page.locator("[name=confirmPassword]").fill("123456")


    await page.getByRole("button", {name:"Create Account"}).click();
    await expect(page.getByText(" Register succesfully")).toBeVisible();
  await expect(page.getByRole("link", {name:"My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name:"My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name:"SignOut"})).toBeVisible();
 })



import { url } from "inspector";
import { browser, By, logging } from "protractor";
import { AppPage } from "./app.po";

describe("Testing Elements Location, Size, Content and Existence on Login page", () => {

  browser.driver.get("http://localhost:4200/login");

  it("Currently Login Page is displayed", () => {
    const currentUrl = browser.driver.getCurrentUrl();
    expect(currentUrl).toContain("/login");
  });

  it("Checking if username field exists", () => {
    const UsernameField = browser.driver.findElement(By.id("Username"));
    expect(UsernameField.isDisplayed()).toBeTruthy();
    expect(UsernameField.isDisplayed()).not.toBeFalsy();
  });

  it("Checking username field position on the login page", () => {
    const UsernameField = browser.driver.findElement(By.id("Username"));
    UsernameField.getLocation().then((value) => {
      expect(value.x).toBe(591);
      expect(value.y).toBe(285.625);
    })
  });

  it("Checking username field size on the login page", () => {
    const UsernameField = browser.driver.findElement(By.id("Username"));
    UsernameField.getSize().then((value) => {
      expect(value.height).toBe(16);
      expect(value.width).toBe(218);
    })
  });

  it("Checking if password field exists", () => {
    const PasswordField = browser.driver.findElement(By.id("Password"));
    expect(PasswordField.isDisplayed()).toBeTruthy();
    expect(PasswordField.isDisplayed()).not.toBeFalsy();
  });

  it("Checking password field position on the login page", () => {
    const PasswordField = browser.driver.findElement(By.id("Password"));
    PasswordField.getLocation().then((value) => {
      expect(value.x).toBe(591);
      expect(value.y).toBe(342.625);
    })
  });

  it("Checking password field size on the login page", () => {
    const PasswordField = browser.driver.findElement(By.id("Password"));
    PasswordField.getSize().then((value) => {
      expect(value.height).toBe(16);
      expect(value.width).toBe(218);
    })
  });

  it("Checking if login button exists", () => {
    const LoginBtn = browser.driver.findElement(By.id("submit"));
    expect(LoginBtn.isDisplayed()).toBeTruthy();
    expect(LoginBtn.isDisplayed()).not.toBeFalsy();
  });

  it("Checking login button position on the login page", () => {
    const LoginBtn = browser.driver.findElement(By.id("submit"));
    LoginBtn.getLocation().then((value) => {
      expect(value.x).toBe(591);
      expect(value.y).toBe(382);
    })
  });

  it("Checking login button size on the login page", () => {
    const LoginBtn = browser.driver.findElement(By.id("submit"));
    LoginBtn.getSize().then((value) => {
      expect(value.height).toBe(36);
      expect(value.width).toBe(218);
    })
  });

  it("Checking the login button content", () => {
    const LoginBtn = browser.driver.findElement(By.id("submit"));
    expect(LoginBtn.getText()).toBe('Login >');
    expect(LoginBtn.getText()).not.toBe('login');
  });

  it("Checking if application name exists on the login page", () => {
    const appName = browser.driver.findElement(By.className("special"));
    expect(appName.getText()).toBe('hoppla');
    expect(appName.getText()).not.toBe('hooppla');
  });

  it("Checking if text exists on the login page card", () => {
    const textOnLoginCard = browser.driver.findElement(By.tagName("mat-card-title"));
    expect(textOnLoginCard.getText()).toBe('Log into your account');
    expect(textOnLoginCard.getText()).not.toBe('Log into your account now');
  });

  it("Checking backgroundimage position on the login page", () => {
    const backgroundImage = browser.driver.findElement(By.id("mainImage"));
    backgroundImage.getLocation().then((value) => {
      expect(value.x).toBe(0);
      expect(value.y).toBe(64);
    })
  });
  
  it("Checking backgroundimage size on the login page", () => {
    const backgroundImage = browser.driver.findElement(By.id("mainImage"));
    backgroundImage.getSize().then((value) => {
      expect(value.height).toBe(525);
      expect(value.width).toBe(720);
    })
  });
  
  it("Logging into application and transferring from login page to dashboard page", () => {
    // Find page elements
    const UsernameField = browser.driver.findElement(By.id("Username"));
    const PasswordField = browser.driver.findElement(By.id("Password"));
    const LoginBtn = browser.driver.findElement(By.id("submit"));

    // Fill input fields
    UsernameField.sendKeys("sai@abc.com");
    PasswordField.sendKeys("Sai@12345");

    // Ensure fields contain what we've entered
    expect(UsernameField.getAttribute("value")).toEqual("sai@abc.com");
    expect(PasswordField.getAttribute("value")).toEqual("Sai@12345");

    // Click to sign in - waiting for Angular as it is manually bootstrapped.
    LoginBtn.click().then(() => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url3) => {
          return /dashboard/.test(url3);
        });
      }, 20000);
    });
  });

  it("Currently Dashboard Page is displayed", () => {
    const currentUrl = browser.driver.getCurrentUrl();
    expect(currentUrl).toContain("/dashboard");
  });

  it("Checking list size on the dashboard page", () => {
    const selectionOptions = browser.driver.findElement(By.id("selectionMenu"));
    selectionOptions.getSize().then((value) => {
      expect(value.height).toBe(32);
      expect(value.width).toBe(200);
    })
  });

  it("Checking list location on the dashboard page", () => {
    const selectionOptions = browser.driver.findElement(By.id("selectionMenu"));
    selectionOptions.getLocation().then((value) => {
      expect(value.x).toBe(106.9375);
      expect(value.y).toBe(16);
    })
  });

  it("Checking list existence on the dashboard page", () => {
    const selectionOptions = browser.driver.findElement(By.id("selectionMenu"));
    expect(selectionOptions.isDisplayed()).toBeTruthy();
  });

  it("Checking content existence on the dashboard page", () => {
    const text = browser.driver.findElement(By.id("welcomeText"));
    expect(text.isDisplayed()).toBeTruthy();
  });

  it("Checking content exact text on the dashboard page", () => {
    const text = browser.driver.findElement(By.id("welcomeText"));
    expect(text.getText()).toContain("welcome");
  });

  it("Checking view orders button existence on the dashboard page", () => {
    const viewBtn = browser.driver.findElement(By.id("view"));
    expect(viewBtn.isDisplayed()).toBeTruthy();
  });

  it("Transferring from dashboard page to view orders page", () => {
    const view = browser.driver.findElement(By.id("view"));
    view.click().then(() => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url2) => {
          return /vieworders/.test(url2);
        });
      }, 20000);
    });
  });

  it("Currently View orders Page is displayed", () => {
    const currentUrl = browser.driver.getCurrentUrl();
    expect(currentUrl).toContain("/vieworders");
  });

  it("Checking content existence on the view orders page", () => {
    const text = browser.driver.findElement(By.id("textMessage"));
    expect(text.isDisplayed()).toBeTruthy();
  });

  it("Checking content exact text on the view orders page", () => {
    const text = browser.driver.findElement(By.id("textMessage"));
    expect(text.getText()).toContain("Your Orders");
  });

  it("Checking content position on the view orders page", () => {
    const text = browser.driver.findElement(By.id("textMessage"));
    text.getLocation().then((value) => {
      expect(value.x).toBe(0);
      expect(value.y).toBe(88);
    })
  });

  it("Checking content size on the view orders page", () => {
    const text = browser.driver.findElement(By.id("textMessage"));
    text.getSize().then((value) => {
      expect(value.height).toBe(29);
      expect(value.width).toBe(1200);
    })
  });

  it("Checking log out button existence on the view orders page", () => {
    const logBtn = browser.driver.findElement(By.id("log"));
    expect(logBtn.isDisplayed()).toBeTruthy();
  });

  it("Logging out of the application", () => {
    const Logout = browser.driver.findElement(By.id("log"));
    Logout.click().then(() => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url1) => {
          return /login/.test(url1);
        });
      }, 20000);
    });
  });
});

describe("Flow between the pages", () => {

  it("Logging into application and transferring from login page to dashboard page", () => {
    // Find page elements
    const UsernameField = browser.driver.findElement(By.id("Username"));
    const PasswordField = browser.driver.findElement(By.id("Password"));
    const LoginBtn = browser.driver.findElement(By.id("submit"));
    // Fill input fields
    UsernameField.sendKeys("sai@abc.com");
    PasswordField.sendKeys("Sai@12345");
    // Ensure fields contain what we've entered
    expect(UsernameField.getAttribute("value")).toEqual("sai@abc.com");
    expect(PasswordField.getAttribute("value")).toEqual("Sai@12345");
    // Click to sign in - waiting for Angular as it is manually bootstrapped.
    LoginBtn.click().then(() => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url3) => {
          return /dashboard/.test(url3);
        });
      }, 20000);
    });
  });

  it("Transferring from dashboard page to view orders page", () => {
    const view = browser.driver.findElement(By.id("view"));
    view.click().then(() => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url2) => {
          return /vieworders/.test(url2);
        });
      }, 20000);
    });
  });

  it("Transferring from view orders page to login page", () => {
    const Logout = browser.driver.findElement(By.id("log"));
    Logout.click().then(() => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url1) => {
          return /login/.test(url1);
        });
      }, 20000);
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

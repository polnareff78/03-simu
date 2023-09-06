global.$ = jest.fn(() => ({
    ready: jest.fn(),
}));
global.document = {
    ready: jest.fn(),
  };

// Mocking localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

const { data} = require('./script');

describe("Frontend - script.js", () => {

    describe("data function", () => {
        it("should return the expected initial data", () => {
            const result = data();
            expect(result).toHaveProperty('suggestedCities', []);
            expect(result).toHaveProperty('step', 1);
            expect(result).toHaveProperty('maxStep', 11);
            expect(result).toHaveProperty('alert', false);
        });
    });

    describe("validateForm function", () => {
        const instance = data(); 

        it("should show alert for step 1 without situation", () => {
            instance.step = 1;
            instance.situation = '';
            instance.validateForm();
            expect(instance.alert).toBe(true);
        });

        it("should not show alert for step 1 with situation", () => {
            instance.step = 1;
            instance.situation = 'Employé';
            instance.validateForm();
            expect(instance.alert).toBe(false);
        });
    });

});

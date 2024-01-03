module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb",
        "airbnb-typescript",
    ],
    "overrides": [{
        "env": {
            "node": true
        },
        "files": [
            ".eslintrc.{js,cjs}"
        ],
        "parserOptions": {
            "sourceType": "script"
        }
    }],
    "parser": '@typescript-eslint/parser',
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "tsconfig.json"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "ignorePatterns": ['.eslintrc.*', 'vite.config.*'],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "quotes": "off",
        "@typescript-eslint/quotes": "off",
        "import/order": [
            2,
            {
                "alphabetize": {
                    "order": "asc"
                }
            }
        ]
    }
}
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
    //eslintを無効にするファイル一覧の設定
    "ignorePatterns": [
        '.eslintrc.*',
        'vite.config.*',
        'tailwind.config.js',
        //ライブラリはeslintを除外したい
        'src/components/ui/*.tsx',
        'src/lib/utils.ts'
    ],
    "rules": {
        "no-alert": "off",
        "no-console": "off",
        "react/react-in-jsx-scope": "off",
        "quotes": "off",
        "@typescript-eslint/quotes": "off",
        'import/no-extraneous-dependencies': ['error', {
            devDependencies: true, // devDependenciesのimportを許可
            optionalDependencies: true,
        }],
        "react/jsx-props-no-spreading": "off",
        "react/require-default-props": "off",
        "react/prop-types": "off",
        "react/jsx-no-constructed-context-values": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "import/prefer-default-export": "off",
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
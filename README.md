# PD23
PD23 is a website that facilitates the recording and the distribution of vouchers and prizes.

The website is hosted here: https://pd23.netlify.app/. If you would like to set-up the project on your local machine, follow the steps below.

# Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve
```

## Compiles and minifies for production
```
npm run build
```

## Lints and fixes files
```
npm run lint
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Features

## HOTO
Records details regarding each voucher distribution shift such as:
- Serial numbers of vouchers assigned at the start of a shift
- Serial numbers of vouchers leftover at the end of a shift
- Starting date and time of a shift
- Ending date and time of a shift

## Voucher Redemption
- Records both the serial number of the voucher being redeemed and the matriculation number of the student who is redeeming it.

## Prize Redemption
- Records the name and telephone number of the person redeeming the prize, as well as the details of the prize being redeemed.
- If the prize is a voucher, its serial number is also recorded.

## Tally
- Provides a condensed overview of redeemed and unredeemed vouchers
- Provides comprehensive information on all vouchers, which can be sorted and searched with ease

## Database
- Edit or delete records
- View a history of previous edits or deleted records
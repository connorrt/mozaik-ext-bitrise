# Mozaïk bitrise widgets

[Based on mozaik-ext-bitrise by lovoo](https://github.com/lovoo/mozaik-ext-bitrise/)

## Bitrise Client Configuration

In order to use the Mozaïk bitrise widgets, you must configure its **client**.

### parameters

key             | env key                         | required | description
----------------|---------------------------------|----------|-----------------------------------
`token`         | BITRISE_API_TOKEN               | yes      | *The Bitrise API Token*

### usage

```javascript
{
  //…
  api: {
    bitrise: {
        token: 'token'
    }
  }
}
```

## Widgets

### Bitrise Build history

![bitrise build history](https://raw.githubusercontent.com/lovoo/mozaik-ext-bitrise/master/preview/bitrise.build_history.png)

> Display bitrise repo build history

#### parameters

key          | required | description
-------------|----------|---------------
`slug`       | yes      | *app slug*
`limit`      | no       | *Limit the fetched builds*

#### usage

```javascript
{
  type: 'bitrise.build_history',
  slug: '<app slug>',
  limit: 10,
  columns: 1, rows: 1, x: 0, y: 0
}
```

### Bitrise Single build status

![bitrise.single_build_status](https://raw.githubusercontent.com/lovoo/mozaik-ext-bitrise/master/preview/bitrise.single_build_status.png)

> Display the build status of a single build.

#### parameters

key          | required | description
-------------|----------|---------------
`slug`       | yes      | *app slug*
`workflow`   | yes      | *workflow id*
`title`      | no       | *An optional title*

#### usage

```javascript
{
    type: 'bitrise.single_build_status',
    title: 'An optional title',
    slug: '<app slug>',
    workflow: '<workflow id>',
    columns: 1, rows: 1, x: 0, y: 0
}
```

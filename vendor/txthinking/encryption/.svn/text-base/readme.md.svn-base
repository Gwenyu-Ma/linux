### Installation

Use Laravel 5 encryption as a standalone component

```
$ composer require txthinking/encryption
```

### Usage

```
<?php
use Tx\CryptProvider;

$crypt = (new CryptProvider([
    'key' => 'abcdefghijhlmnopqrsduvqxyzaaaaaa',
    'cipher' => 'AES-256-CBC',
]))->getInstance();

$r = $crypt->encrypt('who am i');
var_dump($crypt->decrypt($r));
```

### Documentation

http://laravel.com/docs/5.0/validation

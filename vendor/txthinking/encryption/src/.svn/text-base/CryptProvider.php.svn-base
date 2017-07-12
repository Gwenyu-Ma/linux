<?php namespace Tx;

use Illuminate\Container\Container;
use Illuminate\Support\ServiceProvider;
use Illuminate\Encryption\Encrypter;

class CryptProvider extends ServiceProvider {

    protected $conf;
    protected $container;

    public function __construct($conf){
        $this->conf = $conf;
        $this->container = new Container;

        $this->register();
    }

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register()
	{
        $me = $this;
		$this->container->singleton('encrypter', function($me)
		{
			$encrypter =  new Encrypter($this->conf['key'], $this->conf['cipher']);
			return $encrypter;
		});
	}

    public function getInstance(){
        return $this->container['encrypter'];
    }

}

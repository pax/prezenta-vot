<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitab971a0271c086eb5f42e72c8be11919
{
    public static $prefixLengthsPsr4 = array (
        'L' => 
        array (
            'LZCompressor\\' => 13,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'LZCompressor\\' => 
        array (
            0 => __DIR__ . '/..' . '/nullpunkt/lz-string-php/src/LZCompressor',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitab971a0271c086eb5f42e72c8be11919::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitab971a0271c086eb5f42e72c8be11919::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
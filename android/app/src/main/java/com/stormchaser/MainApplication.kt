package com.stormchaser

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
import java.util.Arrays

// Import packages manually
import com.swmansion.gesturehandler.RNGestureHandlerPackage

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
            return Arrays.asList<ReactPackage>(
                MainReactPackage(),
                RNGestureHandlerPackage()
            )
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }

        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
    }
}

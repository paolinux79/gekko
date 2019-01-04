// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).

var log = require('../core/log');
var _ = require('lodash');
// Let's create our own strat
var strat = {};


function isIncreasing(array,size) {
  if (size < 2) {
    return true;
  }
  else
  {
    xs = array.slice(array.length-size, array.length)
    for (var i = 0; i < xs.length - 1; i++) {
      if (xs[i] > xs[i+1]) {
        return false;
      }
    }
    return true;
  }
}

function isDecreasing(array,size) {
  if (size < 2) {
    return true;
  }
  else
  {
    xs = array.slice(array.length-size, array.length)
    for (var i = 0; i < xs.length - 1; i++) {
      if (xs[i] < xs[i+1]) {
        return false;
      }
    }
    return true;
  }
}


function isEnough(lastPrice, currentPrice,threshold){

  let delta = Math.abs(lastPrice - currentPrice);
  let ratio = delta/currentPrice
  let out = (ratio > threshold);
  log.debug(currentPrice, lastPrice, delta, threshold, ratio ,out);
  return out;
}

function isCrossing(shortA, longA, shortB, longB){
  if ( (shortB == longB) || (shortA >= longA && shortB <= longB) || (shortA <= longA && shortB >= longB) )
  {
    return true;
  }
  else
  {
    return false;
  }
}
// Prepare everything our method needs
strat.init = function() {

  this.name = 'CUSTOM';

  this.lastBetPrice = 0;
  this.lastShort;
  this.lastLong;
  this.requiredHistory = this.tradingAdvisor.historySize;

  // define the indicators we need
  this.addIndicator('maShort', 'EMA', this.settings.windowLengthShort);
  this.addIndicator('maLong', 'EMA', this.settings.windowLengthLong);


}

// What happens on every new candle?
strat.update = function(candle) {
}

// For debugging purposes.
strat.log = function() {

}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {

  let windowMonotonicityLength = this.settings.sortedWindow;

  let maShort = this.indicators.maShort;
  let maLong = this.indicators.maLong;
  let currentShort = maShort.result;
  let currentLong = maLong.result;
  let price = candle.close;


  let crossed = isCrossing(this.lastShort, this.lastLong, currentShort, currentLong);
  this.lastShort = currentShort;
  this.lastLong = currentLong;

  if (crossed) {
    if (isIncreasing(this.indicators.maShort.prices, windowMonotonicityLength)) {
      if (isEnough(this.lastBetPrice,price,this.settings.betThreshold)) {
        this.lastBetPrice = price;
        this.advice('long');
      }
      else
      {
        this.advice();
      }
    } else{
      if (isEnough(this.lastBetPrice,price,this.settings.betThreshold)) {
        this.lastBetPrice = price;
        this.advice('short');}
        else
        {
          this.advice();
        }
      }
    }
    else {
      this.advice();
    }


    // if(crossed){
    // if (this.lastBet == 'short'){
    //   this.lastBet = 'long'
    //   this.advice(this.lastBet);
    // } else if (this.lastBet == 'long'){
    //   this.lastBet = 'short'
    //   this.advice(this.lastBet);
    // } else{
    //       this.advice();
    // }
    // }

  }

  module.exports = strat;

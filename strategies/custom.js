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

function isCrossing(shortA, longA, shortB, longB){

  if ((shortA > longA) && (shortB < longA) || (shortA < longA) && (shortB > longA))
  {
    return true;
  }
  return false;
}
// Prepare everything our method needs
strat.init = function() {

  this.name = 'CUSTOM';

  this.currentTrend;
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



  let maShort = this.indicators.maShort;
  let maLong = this.indicators.maLong;
  let currentShort = maShort.result;
  let currentLong = maLong.result;
  let price = candle.close;
  let diff = currentShort - currentLong;
  // let message = '@ ' + price.toFixed(8) + ' (' + currentShort.toFixed(5) + '/' + diff.toFixed(5) + ')';
  log.debug(currentShort + " " + currentLong + " " + diff)
  log.debug(maShort)

//   if ((Math.abs(diff) < this.settings.threshold ) && ((this.lastShort > currentShort) ))
//   {
//     this.lastShort = currentShort;
//     this.lastLong = currentLong;
//     this.advice('long');
//   } else if ((Math.abs(diff) < this.settings.threshold )  && ((this.lastShort < currentShort) )){
//
//
//     this.lastShort = currentShort;
//     this.lastLong = currentLong;
//     this.advice('short');
//   } else
//   {
//   this.lastShort = currentShort;
//   this.lastLong = currentLong;
//   this.advice();
// }
//

  if ( (isCrossing(this.lastShort, this.lastLong, currentShort, currentLong) ) && ((this.lastShort > currentShort) && (this.lastLong > currentLong)))
  {
    this.lastShort = currentShort;
    this.lastLong = currentLong;
    this.advice('short');
  } else if ((isCrossing(this.lastShort, this.lastLong, currentShort, currentLong) )  && ((this.lastShort < currentShort) && (this.lastLong < currentLong))){
    this.lastShort = currentShort;
    this.lastLong = currentLong;
    this.advice('long');
  } else
  {
  this.lastShort = currentShort;
  this.lastLong = currentLong;
  this.advice();
}


  // log.debug(smaLong.prices[smaLong.prices.length-1]);
  let message = '@ ' + price.toFixed(8) + ' (' + currentShort.toFixed(5) + '/' + diff.toFixed(5) + ')';

  // if(diff > this.settings.thresholds.up) {
  //   log.debug('we are currently in uptrend', message);
  //
  //   if(this.currentTrend !== 'up') {
  //     this.currentTrend = 'up';
  //     this.advice('long');
  //   } else
  //     this.advice();
  //
  // } else if(diff < this.settings.thresholds.down) {
  //   log.debug('we are currently in a downtrend', message);
  //
  //   if(this.currentTrend !== 'down') {
  //     this.currentTrend = 'down';
  //     this.advice('short');
  //   } else
  //     this.advice();
  //
  // } else {
  //   log.debug('we are currently not in an up or down trend', message);
  //   this.advice();
  // }
}

module.exports = strat;

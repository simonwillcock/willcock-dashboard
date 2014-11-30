var _ = require('underscore');

exports.updateModel = function(model, SchemaTarget, data) {
    for (var field in SchemaTarget.schema.paths) {
       if ((field !== '_id') && (field !== '__v') 
        && (field !== 'date_modified') && (field !== 'date_created')) {
            var newValue = getObjValue(field, data);
            console.log('data[' + field + '] = ' + newValue);
            if (newValue !== undefined) {
                setObjValue(field, model, newValue);
          }  
       }  
    }
    return model;
};

function getObjValue(field, data) {
    return _.reduce(field.split("."), function(obj, f) { 
        if(obj) return obj[f];
    }, data);
}

function setObjValue(field, data, value) {
  var fieldArr = field.split('.');
  return _.reduce(fieldArr, function(o, f, i) {
     if(i == fieldArr.length-1) {
          o[f] = value;
     } else {
          if(!o[f]) o[f] = {};
     }
     return o[f];
  }, data);
}

exports.updateTimestamps = function(model){
  now = new Date();
  model.date_modified = now;
  if ( !model.date_created ) {
    model.date_created = now;
  }
  return model;
};

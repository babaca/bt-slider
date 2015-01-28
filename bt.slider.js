(function() {



    angular.module('gui')

    .directive('btSlider', [function() {

        var dir = {};
        dir.restrict = 'E';

        dir.scope = {
            id: '=index', // single slider option
            min: '=', // range slider option
            max: '=', // range slider option
            values: '=', //
            disabled: '=' // disabled status
        };

        dir.template = '<div class="bt-slider"><div class="scale-line"></div><div class="indicator-annotation"></div></div>';

        dir.link = function(scope, elem, attrs) {

            // CONFIG
            scope.colorBg = (typeof attrs.color === 'undefined') ? "#ddd" : attrs.color;
            scope.colorOn = (typeof attrs.colorSelected === 'undefined') ? "#333" : attrs.colorSelected;
            scope.colorOff = (typeof attrs.colorDisabled === 'undefined') ? "#999" : attrs.colorDisabled;
            scope.color = scope.colorOn; // default

            scope.indicated = (attrs.indicated === 'true') ? true : false; /* indicator sign */
            scope.dotted = (attrs.dotted === 'true') ? true : false;;
            scope.annotated = (attrs.annotated === 'true') ? true : false;; /* scale annotation signs */
            scope.delay = 150; 



            // DOM REFERECENS
            var dom = {};

            // other passive paramenters
            var valuesNum = scope.values.length - 1,
                spanMax = isNaN(attrs.spanMax) ? valuesNum : +attrs.spanMax,
                spanMin = isNaN(attrs.spanMin) ? 1 : +attrs.spanMin;






            // cleans the dom inside the element from all elements for clean render
            function clean() {
                elem.find('.scale-mark').remove();
                elem.find('.indicator-mark, .indicator-range, .indicator-max, .indicator-min').remove();
                elem.find('.scale-annotation').remove();
                elem.find('.handle').remove();
                elem.find('.indicator-annotation').hide();
            }



            // renders passive elements
            function renderScale() {
                elem.find('.scale-line').css('background-color', scope.colorBg);

                for (var i = 0; i <= valuesNum; i++) {
                    // scale mark
                    if (scope.dotted) {
                        var mark = $('<div>')
                            .addClass('scale-mark')
                            .css('background-color', scope.colorBg)
                            .appendTo(dom.slider);

                        mark.css('left', positionFromId(i, mark.width()));
                    }

                    // scale annotations
                    if (scope.annotated) {
                        var annotation = $('<div>')
                            .addClass('scale-annotation')
                            .css('color', scope.colorBg)
                            .html(scope.values[i])
                            .appendTo(dom.slider);

                        annotation.css('left', positionFromId(i, annotation.width()));
                    }
                };
            }






            function init() {
                // clean the dom
                clean();

                // initial dom references
                angular.extend(dom, {
                    slider: elem.find('.bt-slider'),
                    indicatorAnnotation: elem.find('.indicator-annotation'),
                    scale: elem.find('.scale-line'),
                });

                // disabled state
                if (scope.disabled) {
                    scope.color = scope.colorOff;
                } else {
                    scope.color = scope.colorOn;
                }

                renderScale();

                // set the reference object to make less dom requests
                angular.extend(dom, {
                    annotation: elem.find('.scale-annotation'),
                    dotMarks: elem.find('.scale-mark'),
                });

                // min and max are set -> render range slider
                if ((typeof scope.min !== 'undefined') && (typeof scope.min !== 'undefined')) {
                    renderDoubleIndicator();

                // else if index is set -> render single value slider
                } else if (typeof scope.id !== 'undefined') {
                    renderSingleIndicator();
                }

                // set the reference object to make less dom requests
                angular.extend(dom, {
                    handle: elem.find('.handle'),
                    handleMin: elem.find('.handle-min'),
                    handleMax: elem.find('.handle-max'),
                    // indicator is here also
                    indicatorMin: elem.find('.indicator-min'),
                    indicatorMax: elem.find('.indicator-max'),
                });
            }



            function renderSingleIndicator() {

                // create handle
                dom.handle = $('<div>')
                    .addClass('handle')
                    .width(dom.slider.width() / (valuesNum * 2.1))
                    .appendTo(dom.slider);

                // create indicator mark
                dom.indicator = $('<div>')
                    .addClass('indicator-mark')
                    .css('background-color', scope.color)
                    .appendTo(dom.slider);

                if (scope.indicated) {
                    dom.indicatorAnnotation.css('color', scope.color)
                        .html(scope.values[scope.id])
                        .css('left', positionFromId(scope.id, dom.indicatorAnnotation.width()))
                        .show();
                }

                colorAnnotation(scope.id);

                dom.indicator.css('left', positionFromId(scope.id, dom.indicator.width()));
                dom.handle.css('left', positionFromId(scope.id, dom.handle.width()));

                dom.handle
                    .draggable({
                        containment: 'parent',
                        axis: 'x',
                        delay: scope.delay,
                        start: function() {
                            dom.dragging = true;
                        },
                        drag: function() {
                            if (scope.disabled) {
                                return false;
                            }
                            scope.$apply(function() {
                                scope.id = idFromCoord(dom.handle.offset().left - dom.slider.offset().left);
                            });
                        },
                        stop: function() {
                            dom.dragging = false;
                            // to fire the watch but dont change scope.id
                            scope.$apply(function() {
                                scope.id += 1;
                            });
                            scope.$apply(function() {
                                scope.id -= 1;
                            });
                        }
                    });

                // EVENTS
                dom.slider.on('click', function(e) {
                    if (scope.disabled) {
                        return false;
                    }
                    dom.dragging = false;
                    scope.$apply(function() {
                        scope.id = idFromCoord(e.pageX - dom.slider.offset().left);
                    });
                });
            }


            // renders the range case
            function renderDoubleIndicator() {

                dom.handleMin = $('<div>')
                    .addClass('handle handle-min')
                    .width(dom.slider.width() / valuesNum)
                    .appendTo(dom.slider);

                dom.handleMax = $('<div>')
                    .addClass('handle handle-max')
                    .width(dom.slider.width() / valuesNum)
                    .appendTo(dom.slider);

                dom.indicator = $('<div>')
                    .addClass('indicator-range')
                    .css('background-color', scope.color)
                    .appendTo(dom.slider);

                dom.indicatorMin = $('<div>')
                    .addClass('indicator-mark indicator-min')
                    .css('background-color', scope.color)
                    .appendTo(dom.slider);

                dom.indicatorMax = $('<div>')
                    .addClass('indicator-mark indicator-max')
                    .css('background-color', scope.color)
                    .appendTo(dom.slider);

                // indication positioning
                dom.indicator
                    .css('left', positionFromId(scope.min, dom.indicator.width()))
                    .css('right', dom.slider.width() - positionFromId(scope.max, 0));

                dom.indicatorAnnotation.css('color', scope.color);
                positionIndicationAnnotation();

                // marks of ends of the indication
                dom.indicatorMin.css('left', positionFromId(scope.min, dom.indicatorMin.width()));
                dom.indicatorMax.css('left', positionFromId(scope.max, dom.indicatorMax.width()));

                // handles positioning
                dom.handleMin.css('left', positionFromId(scope.min, dom.handleMin.width()));
                dom.handleMax.css('left', positionFromId(scope.max, dom.handleMax.width()));

                colorAnnotation(scope.max);
                colorAnnotation(scope.min);

                // color selected scale marks
                dom.dotMarks
                    .slice(scope.min, scope.max)
                    .css('background-color', scope.color);

                dom.handleMin
                    .draggable({
                        containment: 'parent',
                        axis: 'x',
                        delay: scope.delay,
                        start: function() {
                            dom.dragging = true;
                        },
                        drag: function() {
                            if (scope.disabled) {
                                return false;
                            }
                            scope.$apply(function() {
                                scope.min = idFromCoord(dom.handleMin.offset().left - dom.slider.offset().left);
                            });
                        },
                        stop: function() {
                            dom.dragging = false;
                            positionHandles();
                        }
                    });

                dom.handleMax
                    .draggable({
                        containment: 'parent',
                        axis: 'x',
                        delay: scope.delay,
                        start: function() {
                            dom.dragging = true;
                        },
                        drag: function() {
                            if (scope.disabled) {
                                return false;
                            }
                            scope.$apply(function() {
                                // + dom.handleMax.width()/1.5 = to make it "almost .right"
                                scope.max = idFromCoord(dom.handleMax.offset().left + dom.handleMax.width() / 1.5 - dom.slider.offset().left); 
                            });
                        },
                        stop: function() {
                            dom.dragging = false;
                            positionHandles();
                        }
                    });

                // EVENTS
                dom.slider.on('click', function(e) {
                    if (scope.disabled) {
                        return false;
                    }
                    dom.dragging = false;

                    var where = idFromCoord(e.pageX - dom.slider.offset().left),
                        distMin = Math.abs(where - scope.min),
                        distMax = Math.abs(where - scope.max);

                    if (distMin < distMax) {
                        scope.min = where; // move min handle
                    } else {
                        scope.max = where; // move max handle
                    }
                    scope.$apply();
                });
            };



            // get position for the center of the obj by defined coords
            function positionFromId(id, widthObj) {
                var idCoord = id / valuesNum * dom.slider.width();
                return idCoord - widthObj / 2;
            }



            // get id for the defined coords
            function idFromCoord(coord) {
                var totalWidth = dom.slider.width();
                return Math.round(coord / totalWidth * valuesNum);
            }






            // SINGLE SLIDER CASE - SCOPE.INDEX
            scope.$watch('id', function(id, id_) {

                // position the selection
                if (dom.indicator) {
                    dom.indicator
                        .stop()
                        .animate({
                            left: positionFromId(id, dom.indicator.width())
                        }, scope.delay);
                }

                // positionIndicationAnnotation for a single case
                if (dom.indicatorAnnotation && scope.indicated) {
                    dom.indicatorAnnotation
                        .hide()
                        .html(scope.values[scope.id])
                        .css('left', positionFromId(scope.id, dom.indicatorAnnotation.width()))
                        .show();
                }
                colorAnnotation(id, id_);
                positionHandles();
            });



            // SINGLE SLIDER CASE - SCOPE.INDEX
            scope.$watch('min', function(min, min_) {

                var shift = min - min_,
                    span = Math.abs(scope.min - scope.max);

                // rules check
                if ((span > spanMax) || (span < spanMin)) {
                    var where = scope.max + shift;
                    if ((where > 0) && (where < valuesNum + 1)) {
                        scope.max += shift; // shift selection
                    } else {
                        scope.min -= shift; // rollback
                    }
                }
                positionIndication();
                positionIndicationAnnotation();
                colorAnnotation(min, min_);
                positionHandles();
            });



            // SINGLE SLIDER CASE - SCOPE.INDEX
            scope.$watch('max', function(max, max_) {

                var shift = max - max_,
                    span = Math.abs(scope.max - scope.min);

                // rules check
                if ((span > spanMax) || (span < spanMin)) {
                    var where = scope.min + shift;
                    if ((where >= 0) && (where <= valuesNum + 1)) {
                        scope.min += shift; // shift selection
                    } else {
                        scope.max -= shift; // rollback
                    }
                }
                colorAnnotation(max, max_);
                positionIndication();
                positionIndicationAnnotation();
                positionHandles();
            });






            // annotated re-coloring
            function colorAnnotation(id, id_) {
                if (dom.annotation) {
                    // on
                    $(dom.annotation[id]).css('color', scope.color);
                    // off
                    if (typeof id_ !== 'undefined') {
                        $(dom.annotation[id_]).css('color', scope.colorBg);
                    }

                }
            }



            // literally what is said in the function name
            function positionIndicationAnnotation() {
                if (dom.indicatorAnnotation && scope.indicated) {
                    var middle = (positionFromId(scope.min, 0) + positionFromId(scope.max, 0)) / 2;

                    dom.indicatorAnnotation
                        .html(scope.values[scope.min] + '&nbsp;&ndash;&nbsp;' + scope.values[scope.max])
                        .css('left', middle - dom.indicatorAnnotation.width() / 2)
                        .show();
                }
            }



            function positionIndication() {
                // position the selection
                if (dom.indicator) {
                    dom.indicator
                        .stop()
                        .animate({
                            left: positionFromId(scope.min, 0),
                            right: dom.slider.width() - positionFromId(scope.max, 0)
                        }, scope.delay);
                }

                // remove dots inbeetween selected area
                if (dom.dotMarks) {
                    dom.dotMarks
                        .css('background-color', scope.colorBg);
                    // hide selected marks
                    dom.dotMarks
                        .slice(scope.min, scope.max)
                        .css('background-color', scope.color);
                }

                //position the indicator
                if (dom.indicatorMax) {
                    dom.indicatorMax
                        .stop()
                        .animate({
                            left: positionFromId(scope.max, dom.indicatorMax.width())
                        }, scope.delay);
                }

                //position the indicator
                if (dom.indicatorMin) {
                    dom.indicatorMin
                        .stop()
                        .animate({
                            left: positionFromId(scope.min, dom.indicatorMin.width())
                        }, scope.delay);
                }
            }



            // position the handle after drag
            function positionHandles() {

                // position the handle
                if (!dom.dragging && dom.handle) {
                    dom.handle
                        .stop()
                        .animate({
                            left: positionFromId(scope.id, dom.handle.width())
                        }, scope.delay);
                }

                if (!dom.dragging && dom.handleMin) {
                    dom.handleMin
                        .stop()
                        .animate({
                            left: positionFromId(scope.min, dom.handle.width())
                        }, scope.delay);
                }
                // position the handle after drag
                if (!dom.dragging && dom.handleMax) {
                    dom.handleMax
                        .stop()
                        .animate({
                            left: positionFromId(scope.max, dom.handleMax.width())
                        }, scope.delay);
                }
            }






            scope.$watch('disabled', function(val, val_) {
                init();
            });

            $(window).on('resize', function() {
                init();
            });

            $(document).on('ready', function() {
                init();
            });
        };

        dir.compile = function(elem, attrs) {
            return dir.link;
        };

        return dir;
    }]);
})();

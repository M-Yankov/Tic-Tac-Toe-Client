/* globals jQuery, angular*/
(function ($) {
    'use strict';

    function SvgService() {
        /**
         * Function pastes svg rectangle in every element with given class name.
         * @param {String} svgElement
         * @param {Number} positionX
         * @param {Number} positionY
         * @param {Number} size
         * @param {String} fillColor
         * @param {String} strokeColor
         * @param {Number} strokeWidth
         * @param {Object} [image]
         * @param {String} image.path
         * @param {Number} image.height
         * @param {Number} image.width
         * @param {Number} image.offsetX
         * @param {Number} image.offsetY
         */
        var createRectangle = function (svgElement, positionX, positionY, size, fillColor, strokeColor, strokeWidth, image) {
            var svgNS = 'http://www.w3.org/2000/svg',
                imageTag,
                imageX,
                imageY;

            var element = document.createElementNS(svgNS, 'rect');
            element.setAttributeNS(null, 'x', positionX + '');
            element.setAttribute('y', positionY + '');
            element.setAttribute('width', size + '');
            element.setAttribute('height', size + '');
            element.setAttribute('fill', fillColor + '');
            element.setAttribute('stroke', strokeColor + '');
            element.setAttribute('stroke-width', strokeWidth + '');

            if (image) {
                imageX = (+positionX + image.offsetX ) + '';
                imageY = (+positionY + image.offsetY ) + '';
                imageTag = document.createElementNS(svgNS, 'image');
                imageTag.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image.path);
                imageTag.setAttribute('x', imageX);
                imageTag.setAttribute('y', imageY);
                imageTag.setAttribute('height', image.height + '');
                imageTag.setAttribute('width', image.width + '');
            }

            $(svgElement).append($(element), $(imageTag));
        };

        return {
            createRect: createRectangle
        };
    }

    angular.module('tttGame.services')
        .factory('svgDrawer', [SvgService]);
}(jQuery));
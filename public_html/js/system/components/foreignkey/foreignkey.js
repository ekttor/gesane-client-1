moduloDirectivas.component('foreignKey', {
    templateUrl: "js/system/components/foreignkey/foreignkey.html",
    controllerAs: 'fk',
    controller: foreignkey,
    bindings: {
        bean: '=',
        form: '=',
        name: '<',
        reference: '<',
        //description: '<',
        required: '<'
    }

});

function foreignkey(serverService, $uibModal) {
    var self = this;



    self.chooseOne = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/system/templates/selection.html',
            // templateUrl: 'js/' + self.reference + '/selection.html',
            controller: serverService.capitalizeWord(self.reference) + "SelectionController",
            size: 'lg'
        }).result.then(function (modalResult) {
            self.change(modalResult);
        });
    };

//    this.$onChanges = function (changesObj) {
//        self.change(self.bean.id);
//    };

//    self.$doCheck = function () {
//        self.change(self.bean.id);
//    };

//    self.$doCheck = function () {
//        self.change(self.bean.data.id);
//    }




//    var oldid = null;
//    self.$doCheck = function () {
//        if (oldid == self.bean.data.id) {
//            return
//        } else {
//            oldid = self.bean.data.id;
//            console.log("foreign: " + self.bean.data.id);
//            self.change(self.bean.data.id);
//        }
//    };

    self.change = function (id) {
        if (!self.required && (id <= 0 || id === "" || id === undefined)) {
            self.bean.data.id = null;

            validity(true);
            return;
        }
        if (self.bean) {
            serverService.promise_getOne(self.reference, id).then(function (response) {
                var old_id = id;
                self.bean = response.data.message;
                if (response.data.message.data.id <= 0) {
                    validity(false);
                    self.bean.id = old_id;
                } else {

                    validity(true);

                    self.desc = self.getDesc();
                }
            }).catch(function (data) {
                validity(false);
            });
        }
    };

    var validity = function (isValid) {
        if (self.form[self.name]) {
            self.form[self.name].$setValidity('exists', isValid);
        }
    };
    this.getDesc = function () {
        var arrayLength = self.bean.metaprops.length;
        var description = "";
        for (var i = 0; i < arrayLength; i++) {
            if (self.bean.metaprops[i].foreigndescription) {
                description += self.bean.data[self.bean.metaprops[i].name] + " ";
            }
        }
        description=description.trim();
        if (description=="undefined"){
            description="";
        }
        return description;
    };
    this.$onInit = function () {

        self.desc = self.getDesc();
    }
}



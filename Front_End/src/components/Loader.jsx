import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl mb-8 mx-auto"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Utensils className="text-white w-10 h-10" />
        </motion.div>
        
        <motion.h2
          className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          NepaliThali
        </motion.h2>
        
        <motion.p
          className="text-gray-600 text-lg"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Preparing your authentic Nepali experience...
        </motion.p>
        
        <motion.div
          className="flex justify-center gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
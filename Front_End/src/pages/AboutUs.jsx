import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Heart, Star, Utensils } from 'lucide-react';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Clock, label: 'Years Experience', value: '10+' },
    { icon: Heart, label: 'Dishes Served', value: '1M+' }
  ];

  const team = [
    {
      name: 'Chef Ramesh Gurung',
      role: 'Head Chef',
      image: 'https://images.unsplash.com/photo-1583394293214-28a5b0a8e8b8?auto=format&fit=crop&w=400&q=80',
      description: 'Master of traditional Nepali cuisine with 15+ years experience in authentic cooking.'
    },
    {
      name: 'Sita Sharma',
      role: 'Spice Master',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=400&q=80',
      description: 'Expert in traditional spice blending and authentic Nepali flavor combinations.'
    },
    {
      name: 'Bikash Thapa',
      role: 'Sous Chef',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
      description: 'Specialist in traditional cooking techniques and regional Nepali dishes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-6">
              About <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">NepaliThali</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're passionate about bringing you the finest authentic Nepali culinary experiences, crafted with love and served with traditional excellence.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2014 in the heart of Pokhara, NepaliThali began as a small family restaurant with a big dream: to preserve and share the authentic flavors of Nepal with food lovers everywhere. What started as a passion project has grown into a beloved culinary destination.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to using only the freshest local ingredients, combined with traditional cooking techniques and recipes passed down through generations, has made us a favorite among both locals and visitors to beautiful Pokhara.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">4.9/5 from 2,500+ reviews</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
                alt="Restaurant interior"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Utensils className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="font-bold text-gray-800">10+ Years</p>
                    <p className="text-gray-600 text-sm">of Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To preserve and share the authentic flavors of Nepal while creating memorable dining experiences that bring communities together through traditional food.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Authentic Ingredients',
                description: 'We source only the finest, freshest ingredients from local farms and trusted suppliers across Nepal.',
                icon: '🌱'
              },
              {
                title: 'Traditional Recipes',
                description: 'Our skilled chefs bring generations of experience and authentic family recipes to every dish.',
                icon: '👨‍🍳'
              },
              {
                title: 'Customer Satisfaction',
                description: 'Your happiness is our priority. We go above and beyond to exceed expectations with every meal.',
                icon: '😊'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center"
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The talented individuals behind every delicious dish and exceptional experience at NepaliThali.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;